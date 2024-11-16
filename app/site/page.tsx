"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CREATE_SITE, GET_SITE_BY_ID } from "../constants";
import { useNotification } from "../utils/useNotification";
import React from "react";
import Loader from "../components/Loader";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.any().refine((files) => files?.length == 1, "Image is required."),
    url: z.string().optional(),
    author: z.string().optional(),
    isTrending: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Params = { id?: string };
// interface SiteData {
//     title: string;
//     description: string;
//     image: string;
//     url: string;
//     author: string;
//     isTrending: boolean;
//     updatedAt: string;
//     _id: string;
// }

const Site = (context: any) => {

    const params: Params = React.use(context?.searchParams);
    const { id } = params;

    const [loading, setLoading] = React.useState(true);
    const { showAlert } = useNotification();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (value) => {
        try {
            const { image } = value;

            const res = await fetch(CREATE_SITE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...value, image: image[0].name }),
            });

            const data = await res.json();

            if (data.success) {
                showAlert("success", "Site created successfully!");
                reset();
            } else {
                showAlert("error", "Failed to create site!");
                reset();
            }
        } catch (error: any) {
            console.error("Failed to create site", error.message);
            reset();
        }
    };

    React.useEffect(() => {
        if (id) {
            async function fetchSingleId() {
                try {
                    const res = await fetch(`${GET_SITE_BY_ID}/${id}`);
                    const data = await res.json();
                    console.log("data", data.data);
                } catch (error: any) {
                    console.error("Failed to fetch data based on id", error.message)
                } finally {
                    setLoading(false);
                }
            }

            fetchSingleId()
        }
    }, [id])



    if (loading) return <Loader />;


    const isButtonDisabled = isSubmitting || !isValid;

    return (
        <form
            className="px-8 pt-6 pb-8 mb-4 space-y-6 min-h-screen"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-2">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-200"
                >
                    Title*
                </label>
                <input
                    {...register("title")}
                    placeholder="Title of your site"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
                {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-200"
                >
                    Description*
                </label>
                <textarea
                    placeholder="Description of your site"
                    {...register("description")}
                    rows={5}
                    className="w-full px-3 resize-none py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="img" className="block text-sm font-medium text-gray-200">
                    Select image:*
                </label>

                <input
                    type="file"
                    {...register("image")}
                    id="img"
                    accept="image/*"
                    className="w-fit text-sm outline-none text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-600 file:text-gray-100 hover:file:bg-slate-700"
                />
                {errors.image && (
                    <span className="text-red-500">{(errors.image as any)?.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-medium text-gray-200">
                    Url
                </label>
                <input
                    {...register("url")}
                    placeholder="Link of your site"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-200"
                >
                    Author
                </label>
                <input
                    {...register("author")}
                    placeholder="Author name"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
            </div>

            <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        {...register("isTrending")}
                        type="checkbox"
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-700"></div>
                </label>
                <span className="text-sm font-medium text-gray-200">isTrending</span>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`w-fit font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-700
                    ${isButtonDisabled
                            ? "bg-slate-400 text-gray-300 cursor-not-allowed"
                            : "bg-slate-600 hover:bg-slate-700 text-white"
                        }`}
                >
                    {isSubmitting ? "Publishing" : "Publish"}
                </button>
            </div>
        </form>
    );
};

export default Site;
