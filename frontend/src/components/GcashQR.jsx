import React from "react";
import { assets } from "../assets/assets";

export default function GcashQR() {
    return (
        <img
            src={assets.gcash_qr}
            alt="Gcash QR"
            className="w-48 h-48 object-contain mx-auto border rounded bg-white p-2"
            loading="lazy"
        />
    );
}
