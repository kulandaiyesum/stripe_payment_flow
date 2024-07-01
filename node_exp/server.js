import express from "express";
import "dotenv/config";
import Stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";
const port = process.env.PORT || 3000;
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/checkout", async (req, res) => {
  const product = req.body;
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
    res.status(200).json(session);
  } catch (error) {
    console.log("Error in checkout: ", error);
    return res.status(500).json("Internal Server Error");
  }
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
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
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session)

      // Payment.findOneAndUpdate(
      //   { stripeSessionId: session.id },
      //   { status: "succeeded" },
      //   { new: true },
      //   (err, doc) => {
      //     if (err) {
      //       console.log("Error updating payment status", err);
      //     } else {
      //       console.log("Payment status updated to succeeded", doc);
      //     }
      //   }
      // );
    }

    response.json({ received: true });
  }
);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
