import Stripe from "stripe";
import { currencyConvert } from "~/lib/clientFunctions";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_SECRET_KEY);

export default async function apiHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const body = req.body.cartData;
        const exchangeRate = req.body.exchangeRate;
        const price = body.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.price,
          0,
        );
        const discountPrice =
          body.deliveryInfo.cost +
          (price - (body.coupon.discount / 100) * price);
        const payAmountUsd = currencyConvert(discountPrice, exchangeRate);
        const priceFormatStripe = Math.round(payAmountUsd * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: priceFormatStripe,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
        });
        res.status(200).send({
          clientSecret: paymentIntent.client_secret,
          price: payAmountUsd,
          error: null,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
