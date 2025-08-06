import BookingSuccessClient from "../_components/booking-success";


export default function Page({ searchParams }) {
  // searchParams is a plain JS object: { name: 'John Doe', email: 'x@y.com', ... }
  return <BookingSuccessClient searchParams={searchParams} />;
}