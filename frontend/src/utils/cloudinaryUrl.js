export const cloudinaryUrl = (baseUrl, { w, h, crop = "fill", quality = "auto", format = "auto" }) => {
    if (!baseUrl) return "";

    return baseUrl.replace("/upload/", `/upload/w_${w},h_${h},c_${crop},f_${format},q_${quality}/`);
};
