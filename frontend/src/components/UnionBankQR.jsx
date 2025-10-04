import React from "react";
import { assets } from "../assets/assets";

export default function UnionBankQR() {
    return (
        <img
            src={assets.ub_qr}
            alt="UnionBank QR"
            className="w-48 h-48 object-contain mx-auto border rounded bg-white p-2"
            loading="lazy"
        />
    );
}
