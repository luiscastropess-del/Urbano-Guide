"use client";

import { useState, useEffect } from "react";
import { getComments, addComment } from "@/app/actions.comments";
import { Comment, User } from "@prisma/client";
import { Star, Send } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type CommentWithUser = Comment & { user: User };

export default function CommentSection({ placeId, cityId, guideId }: { placeId?: string, cityId?: string, guideId?: string }) {
    const { showToast } = useToast();
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        getComments({ placeId, cityId, guideId }).then(setComments);
    }, [placeId, cityId, guideId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addComment({ placeId, cityId, guideId, text, rating });
            setText("");
            setRating(5);
            const newComments = await getComments({ placeId, cityId, guideId });
            setComments(newComments);
            showToast("Comentário adicionado!");
        } catch (err) {
            showToast("Erro ao adicionar comentário");
        }
    };

    return (
        <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Comentários</h3>
            
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <textarea 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    className="w-full p-2 mb-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm" 
                    placeholder="Escreva seu comentário..."
                />
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map(r => (
                            <Star key={r} size={20} className={r <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} onClick={() => setRating(r)}/>
                        ))}
                    </div>
                    <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        Enviar <Send size={16} />
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="font-bold text-sm mb-1">{comment.user.name}</div>
                        <div className="flex text-amber-400 text-xs mb-2">
                            {[1, 2, 3, 4, 5].map(r => <Star key={r} size={12} className={r <= comment.rating ? "fill-amber-400" : "opacity-30"} />)}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
