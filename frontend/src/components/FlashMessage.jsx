import { useState } from "react";
import "./FlashMessage.css";

export default function FlashMessage({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(true);

    if (!message || !visible) return null;

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    return (
        <div className={`wh-flash wh-flash-${type}`}>
            <span>{message}</span>
            <button className="wh-flash-close" onClick={handleClose}>
                ×
            </button>
        </div>
    );
}
