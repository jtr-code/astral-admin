"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.any().refine((files) => files?.length == 1, "Image is required."),
    url: z.string().optional(),
    author: z.string().optional(),
    isTrending: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Site = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

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
                    placeholder="Add your description"
                    {...register("description")}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
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
                    className="w-full text-sm outline-none text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-600 file:text-gray-100 hover:file:bg-slate-700"
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
                    className="w-fit bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-700"
                >
                    Publish
                </button>
            </div>
        </form>
    );
};

export default Site;
