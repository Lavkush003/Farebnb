import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking, getListingBookedDates } from "../api";
import { differenceInDays, format, addDays, startOfDay } from "date-fns";
import { FaStar, FaChevronDown, FaUserFriends, FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./BookingWidget.css";

export default function BookingWidget({ listing }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({ cardNumber: "", expiry: "", cvv: "", upiId: "" });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [guests, setGuests] = useState(1);
    const [disabledDates, setDisabledDates] = useState([]);

    useEffect(() => {
        if (!listing?._id) return;
        const fetchDates = async () => {
            try {
                const res = await getListingBookedDates(listing._id);
                const datesToDisable = [];
                res.data.forEach(booking => {
                    let current = startOfDay(new Date(booking.startDate));
                    const end = startOfDay(new Date(booking.endDate));
                    while (current < end) {
                        datesToDisable.push(new Date(current));
                        current = addDays(current, 1);
                    }
                });
                setDisabledDates(datesToDisable);
            } catch (err) {
                console.error("Failed to fetch booked dates", err);
            }
        };
        fetchDates();
    }, [listing?._id]);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // default 2 nights
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;
    const rawDiff = differenceInDays(endDate, startDate);
    const nightCount = rawDiff > 0 ? rawDiff : 1;

    const pricePerNight = listing?.price || 0;
    const baseTotal = pricePerNight * nightCount;
    const cleaningFee = 500;
    const serviceFee = 350;
    const taxes = Math.round((baseTotal + cleaningFee + serviceFee) * 0.18);
    const totalPrice = baseTotal + cleaningFee + serviceFee + taxes;

    const maxAllowedGuests = listing?.maxGuests || 4;

    const handleReserve = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setError(null);
        setShowPayment(true);
    };

    const handlePaymentDetailChange = (event) => {
        const { name, value } = event.target;
        setPaymentDetails((current) => ({ ...current, [name]: value }));
    };

    const handleConfirmReservation = async (event) => {
        event.preventDefault();
        if (!paymentMethod) {
            setError("Please select a payment method");
            return;
        }
        if (paymentMethod === "card" && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
            setError("Please enter your card details");
            return;
        }
        if (paymentMethod === "online" && !paymentDetails.upiId) {
            setError("Please enter your UPI ID");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createBooking(listing._id, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                guests,
                totalPrice,
                paymentMethod,
            });
            setBookingSuccess(true);
            setTimeout(() => {
                navigate("/my-trips");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to complete reservation");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-booking-widget-card">
            {/* Header */}
            <div className="wh-booking-widget-header">
                <div className="wh-booking-price-header">
                    <span className="wh-booking-rate">
                        ₹{pricePerNight.toLocaleString("en-IN")}
                    </span>
                    <span className="wh-booking-unit"> / night</span>
                </div>
                <div className="wh-booking-rating-hint">
                    <FaStar className="wh-star-sm" />
                    <span>
                        {listing?.reviews?.length > 0
                            ? (
                                  listing.reviews.reduce((a, b) => a + (b.rating || 5), 0) /
                                  listing.reviews.length
                              ).toFixed(1)
                            : "5.0"}
                    </span>
                    <span className="wh-booking-review-count">
                        · {listing?.reviews?.length || 1} review{listing?.reviews?.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Inputs Box */}
            <div className="wh-booking-box">
                <div
                    className="wh-booking-dates-row"
                    onClick={() => {
                        setShowDatePicker(!showDatePicker);
                        setShowGuestPicker(false);
                    }}
                >
                    <div className="wh-date-col">
                        <span className="wh-box-label">CHECK-IN</span>
                        <span className="wh-box-value">{format(startDate, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="wh-date-col wh-checkout-col">
                        <span className="wh-box-label">CHECKOUT</span>
                        <span className="wh-box-value">{format(endDate, "dd/MM/yyyy")}</span>
                    </div>
                </div>

                {showDatePicker && (
                    <div className="wh-calendar-modal-dropdown">
                        <DateRange
                            ranges={dateRange}
                            onChange={handleSelect}
                            minDate={new Date()}
                            disabledDates={disabledDates}
                            rangeColors={["#ff385c"]}
                            showDateDisplay={false}
                        />
                        <button
                            type="button"
                            className="wh-btn-calendar-close"
                            onClick={() => setShowDatePicker(false)}
                        >
                            Done
                        </button>
                    </div>
                )}

                <div
                    className="wh-booking-guests-row"
                    onClick={() => {
                        setShowGuestPicker(!showGuestPicker);
                        setShowDatePicker(false);
                    }}
                >
                    <div className="wh-guests-info">
                        <span className="wh-box-label">GUESTS</span>
                        <span className="wh-box-value">
                            {guests} guest{guests > 1 ? "s" : ""}
                        </span>
                    </div>
                    <FaChevronDown className="wh-chevron-icon" />
                </div>

                {showGuestPicker && (
                    <div className="wh-guests-dropdown">
                        <div className="wh-guest-row">
                            <div className="wh-guest-desc">
                                <strong>Guests</strong>
                                <span>Age 13+ (Max {maxAllowedGuests})</span>
                            </div>
                            <div className="wh-guest-counter">
                                <button
                                    type="button"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    disabled={guests <= 1}
                                >
                                    -
                                </button>
                                <span>{guests}</span>
                                <button
                                    type="button"
                                    onClick={() => setGuests(Math.min(maxAllowedGuests, guests + 1))}
                                    disabled={guests >= maxAllowedGuests}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="wh-btn-calendar-close"
                            onClick={() => setShowGuestPicker(false)}
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="wh-booking-error-alert">{error}</div>}

            {bookingSuccess ? (
                <div className="wh-booking-success-alert">
                    <FaCheckCircle /> Reservation confirmed! Redirecting to your trips...
                </div>
            ) : showPayment ? (
                <form className="wh-payment-panel" onSubmit={handleConfirmReservation}>
                    <div className="wh-payment-heading">
                        <div>
                            <span className="wh-box-label">PAYMENT</span>
                            <h3>Choose how to pay</h3>
                        </div>
                        <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="wh-payment-options">
                        <label className={`wh-payment-option ${paymentMethod === "cash" ? "selected" : ""}`}>
                            <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === "cash"} onChange={(event) => setPaymentMethod(event.target.value)} />
                            <FaMoneyBillWave /><span>Cash</span>
                        </label>
                        <label className={`wh-payment-option ${paymentMethod === "card" ? "selected" : ""}`}>
                            <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={(event) => setPaymentMethod(event.target.value)} />
                            <FaCreditCard /><span>Debit / Credit Card</span>
                        </label>
                        <label className={`wh-payment-option ${paymentMethod === "online" ? "selected" : ""}`}>
                            <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === "online"} onChange={(event) => setPaymentMethod(event.target.value)} />
                            <FaMobileAlt /><span>Online Payment</span>
                        </label>
                    </div>
                    {paymentMethod === "card" && (
                        <div className="wh-payment-fields">
                            <input name="cardNumber" placeholder="Card number" inputMode="numeric" value={paymentDetails.cardNumber} onChange={handlePaymentDetailChange} />
                            <div className="wh-payment-field-row">
                                <input name="expiry" placeholder="MM/YY" value={paymentDetails.expiry} onChange={handlePaymentDetailChange} />
                                <input name="cvv" placeholder="CVV" inputMode="numeric" value={paymentDetails.cvv} onChange={handlePaymentDetailChange} />
                            </div>
                            <small>Demo checkout: card details are not stored or charged.</small>
                        </div>
                    )}
                    {paymentMethod === "online" && (
                        <div className="wh-payment-fields">
                            <input name="upiId" placeholder="Enter UPI ID" value={paymentDetails.upiId} onChange={handlePaymentDetailChange} />
                            <small>Demo checkout: no real payment is processed.</small>
                        </div>
                    )}
                    <div className="wh-payment-actions">
                        <button type="button" className="wh-btn wh-btn-outline" onClick={() => setShowPayment(false)}>Back</button>
                        <button type="submit" className="wh-btn wh-btn-primary wh-booking-reserve-btn" disabled={submitting}>
                            {submitting ? "Confirming..." : "Confirm Reservation"}
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    className="wh-btn wh-btn-primary wh-btn-full wh-booking-reserve-btn"
                    onClick={handleReserve}
                    disabled={submitting}
                >
                    {submitting ? "Processing Reservation..." : "Reserve Now"}
                </button>
            )}

            <p className="wh-booking-no-charge-text">You won't be charged yet</p>

            {/* Price Breakdown */}
            <div className="wh-price-breakdown">
                <div className="wh-breakdown-row">
                    <span>
                        ₹{pricePerNight.toLocaleString("en-IN")} × {nightCount} night{nightCount > 1 ? "s" : ""}
                    </span>
                    <span>₹{baseTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="wh-breakdown-row">
                    <span>Cleaning fee</span>
                    <span>₹{cleaningFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="wh-breakdown-row">
                    <span>Farebnb service fee</span>
                    <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="wh-breakdown-row">
                    <span>Taxes & GST (18%)</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                </div>
                <hr className="wh-breakdown-divider" />
                <div className="wh-breakdown-row wh-breakdown-total">
                    <span>Total before taxes</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>
    );
}
