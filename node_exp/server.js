import express from "express";
import "dotenv/config";
import Stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
const port = process.env.PORT || 3000;
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

mongoose.connect(process.env.DATABASE_URI);

const paymentSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  stripeSessionId: String,
  status: String,
  productName: String,
  productId: String,
  deliveryTime: String,
  createdAt: { type: Date, default: Date.now },
});
const subscriptionSchema = new mongoose.Schema({
  userId: String,
  stripeSubscriptionId: String, // important
  status: String, // important
  sessionId: String, // important
  custormerId: String, // important
  plan: String, // e.g., 'monthly', 'yearly'
  current_period_end: Number, // Unix timestamp for subscription end date
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
const Subscription = mongoose.model("Subscription", subscriptionSchema);

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_KEY
      );
    } catch (err) {
      console.log("error: ", err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(`\n\n\n event is\n\n ${event} \n\n\n`);
      console.log(session);
      if (session.mode === "payment") {
        try {
          const paymentObj = await Payment.findOne({
            stripeSessionId: session.id,
          });
          paymentObj.status = "complete";
          await paymentObj.save();
        } catch (error) {
          console.log("error in checkout.session.completed", error.message);
        }
      }
      if (session.mode === "subscription") {
        try {
          const subscriptionObj = await Subscription.findOne({
            sessionId: session.id,
          });
          subscriptionObj.status = session.status;
          subscriptionObj.custormerId = session.customer;
          subscriptionObj.stripeSubscriptionId = session.subscription;
          await subscriptionObj.save();
          console.log("subscription saved successfully");
        } catch (error) {
          console.log("error in checkout subscription", error.message);
        }
      }
    }
    response.json({ received: true });
  }
);

app.use(bodyParser.json());

app.post("/checkout", async (req, res) => {
  const { product, isPremium } = req.body;
  const deliveryTime = isPremium ? "3-4 days" : "5-10 days";
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:4200/cancel",
    });

    const payment = new Payment({
      userId: "user1",
      amount: product.amount,
      stripeSessionId: session.id,
      status: "pending",
      productName: product.name,
      productId: product.id,
      deliveryTime,
    });

    await payment.save();

    res.status(200).json(session);
  } catch (error) {
    console.log("Error in checkout: ", error);
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/create-subscription", async (req, res) => {
  const { userId } = req.body;
  const userEmail = "test123@gmail.com";
  const userAuth = userEmail;
  try {
    const session = await stripe.checkout.sessions.create({
      success_url:
        "http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:4200/cancel",
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "company",
              description:
                "Relevant for multiple users, extended & premium support.",
            },
            unit_amount: "49900",
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userAuth,
      },
    });
    const newSubscription = new Subscription({
      userId,
      status: session.status,
      sessionId: session.id,
      plan: "monthly",
      current_period_end: session.current_period_end,
    });

    await newSubscription.save();
    res.send({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/cancel-subscription", async (req, res) => {
  let { userId } = req.body;
  if (!userId) {
    userId = "user1";
  }

  const subscription = await Subscription.findOne({ userId, status: "complete" });

  if (!subscription) {
    return res.status(404).send({ error: "No active subscription found" });
  }
  console.log("sub is " , subscription)
  try {
    const deletedSubscription = await stripe.subscriptions.cancel(
      subscription.stripeSubscriptionId
    );
    subscription.status = "canceled";
    await subscription.save();
    res.send({ success: true, subscription: deletedSubscription });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ error: "Failed to cancel subscription" });
  }
});

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
});
