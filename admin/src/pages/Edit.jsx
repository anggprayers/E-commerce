import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Edit = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubcategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

    // fetch product to edit
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.post(backendUrl + "/api/product/single", {
                    productId: id,
                });
                if (response.data.success) {
                    const p = response.data.product;
                    setName(p.name);
                    setDescription(p.description);
                    setPrice(p.price);
                    setCategory(p.category);
                    setSubcategory(p.subCategory);
                    setBestseller(p.bestseller);
                    setSizes(p.sizes || []);

                    // load current images
                    setImage1(p.image[0] || false);
                    setImage2(p.image[1] || false);
                    setImage3(p.image[2] || false);
                    setImage4(p.image[3] || false);
                } else {
                    toast.error(response.data.message);
                }
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchProduct();
    }, [id]);

    // actual submit logic
    const updateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            image1 && typeof image1 !== "string" && formData.append("image1", image1);
            image2 && typeof image2 !== "string" && formData.append("image2", image2);
            image3 && typeof image3 !== "string" && formData.append("image3", image3);
            image4 && typeof image4 !== "string" && formData.append("image4", image4);

            const response = await axios.post(backendUrl + "/api/product/update", formData, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/list");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to update this product?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                updateProduct();
                                closeToast();
                            }}
                            className="px-2 py-1 bg-blue-600 text-white rounded"
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className="px-2 py-1 bg-gray-300 rounded">
                            No
                        </button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    // helper for image preview (works with both string urls and File objects)
    const previewImage = (img) => {
        if (!img) return assets.upload_area;
        return typeof img === "string" ? img : URL.createObjectURL(img);
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
            <div>
                <p className="mb-2">Upload Image</p>
                <div className="flex gap-2">
                    <label htmlFor="image1">
                        <img className="w-20" src={previewImage(image1)} alt="" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img className="w-20" src={previewImage(image2)} alt="" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img className="w-20" src={previewImage(image3)} alt="" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img className="w-20" src={previewImage(image4)} alt="" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>

            <div className="w-full">
                <p className="mb-2">Product Name</p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full max-w-[500px] px-3 py-2"
                    type="text"
                    placeholder="Type product name here"
                    required
                />
            </div>
            <div className="w-full">
                <p className="mb-2">Product Description</p>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full max-w-[500px] px-3 py-2"
                    placeholder="Type product description here"
                    required
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Product Category</p>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2">
                        <option value="Jerseyset">Jersey Set</option>
                        <option value="Topsandtshirts">Tops & T-shirts</option>
                        <option value="Shorts">Shorts</option>
                        <option value="Pantsandleggings">Pants & Leggings</option>
                        <option value="Hoodies">Hoodies</option>
                        <option value="Jackets">Jackets</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Gender</p>
                    <select
                        value={subCategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full px-3 py-2"
                    >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Product Price</p>
                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="w-full px-3 py-2 sm:w-[120px]"
                        type="number"
                        placeholder="25"
                    />
                </div>
            </div>

            <div>
                <p className="mb-2">Product Sizes</p>
                <div className="flex gap-3 flex-wrap">
                    {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map((size) => (
                        <div
                            key={size}
                            onClick={() =>
                                setSizes((prev) =>
                                    prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                                )
                            }
                        >
                            <p
                                className={`${
                                    sizes.includes(size) ? "bg-red-500 text-white" : "bg-slate-200 text-black"
                                } px-3 py-1 cursor-pointer`}
                            >
                                {size}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    onChange={() => setBestseller((prev) => !prev)}
                    checked={bestseller}
                    type="checkbox"
                    id="bestseller"
                />
                <label className="cursor-pointer" htmlFor="bestseller">
                    Add to bestseller
                </label>
            </div>

            <button type="submit" className="w-28 py-3 mt-4 bg-blue-600 text-white active:bg-red-500 cursor-pointer">
                UPDATE
            </button>
        </form>
    );
};

export default Edit;
