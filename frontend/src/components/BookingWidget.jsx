import { useState } from "react";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../api";
import { differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./BookingWidget.css";

export default function BookingWidget({ listing }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;
    const nightCount = differenceInDays(endDate, startDate) || 1;
    const pricePerNight = listing.price || 0;
    const cleaningFee = 500;
    const totalBeforeTax = (pricePerNight * nightCount) + cleaningFee;
    const taxes = Math.round(totalBeforeTax * 0.18);
    const totalPrice = totalBeforeTax + taxes;

    const handleReserve = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createBooking(listing._id, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalPrice,
            });
            navigate("/my-trips");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to make reservation");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="wh-booking-widget">
            <div className="wh-booking-header">
                <h3>
                    ₹{pricePerNight.toLocaleString("en-IN")} <span>/ night</span>
                </h3>
            </div>

            <div className="wh-booking-calendar">
                <DateRange
                    ranges={dateRange}
                    onChange={handleSelect}
                    minDate={new Date()}
                    rangeColors={["#e63946"]}
                    showDateDisplay={false}
                />
            </div>

            {error && <div className="wh-booking-error">{error}</div>}

            <button
                className="wh-btn wh-btn-primary wh-btn-full wh-reserve-btn"
                onClick={handleReserve}
                disabled={submitting}
            >
                {submitting ? "Reserving..." : "Reserve"}
            </button>

            <p className="wh-booking-note">You won't be charged yet</p>

            <div className="wh-booking-details">
                <div className="wh-booking-row">
                    <span>
                        ₹{pricePerNight.toLocaleString("en-IN")} x {nightCount} nights
                    </span>
                    <span>₹{(pricePerNight * nightCount).toLocaleString("en-IN")}</span>
                </div>
                <div className="wh-booking-row">
                    <span>Cleaning fee</span>
                    <span>₹{cleaningFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="wh-booking-row">
                    <span>Taxes (18% GST)</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                </div>
                <hr className="wh-booking-divider" />
                <div className="wh-booking-row wh-booking-total">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>
    );
}
