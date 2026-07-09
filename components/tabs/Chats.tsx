"use client";
import * as React from "react";
import type { Chat } from "@/lib/data";
import { ChatIcon, ChevronRight } from "../icons";
import { ChatView } from "../ChatView";
import { EmptyState } from "../EmptyState";
import { useUser } from "../UserProvider";

type ChatItem=Chat&{isSupport?:boolean};
export function Chats({openSupport=0,onSupportOpened}:{openSupport?:number;onSupportOpened?:()=>void}){
 const{initData}=useUser();const[items,setItems]=React.useState<ChatItem[]>([]),[open,setOpen]=React.useState<ChatItem|null>(null),[loading,setLoading]=React.useState(true);
 React.useEffect(()=>{if(!initData)return;fetch(`/api/chats?initData=${encodeURIComponent(initData)}`).then(r=>r.json()).then(data=>{const next=data.items||[];setItems(next);if(openSupport){const support=next.find((item:ChatItem)=>item.isSupport);if(support)setOpen(support);onSupportOpened?.()}}).finally(()=>setLoading(false))},[initData,openSupport,onSupportOpened]);
 if(open)return <ChatView chat={open} onBack={()=>setOpen(null)}/>;
 return <div className="stagger"><header className="mb-6"><h1 className="text-2xl font-bold">Чаты</h1><p className="mt-1 text-sm text-ink-muted">Заказы и поддержка</p></header>{loading?<div className="space-y-3"><div className="h-16 animate-pulse rounded-2xl bg-card"/><div className="h-16 animate-pulse rounded-2xl bg-card"/></div>:items.length===0?<EmptyState icon={ChatIcon} title="Чатов пока нет" subtitle="Поддержка появится автоматически"/>:<div className="space-y-2">{items.map(chat=><button key={chat.id} onClick={()=>setOpen(chat)} className={`press flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-border ${chat.isSupport?'bg-brand-red/10':'bg-card'}`}>{chat.isSupport?<img src="/logo.png" alt="Hundler Work" className="h-12 w-12 rounded-2xl bg-card object-contain p-1"/>:chat.photoUrl?<img src={chat.photoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover"/>:<div className="grid h-12 w-12 place-items-center rounded-2xl bg-raise font-bold">{chat.name[0]}</div>}<div className="min-w-0 flex-1"><div className="flex items-center gap-2"><div className="truncate font-bold">{chat.name}</div>{chat.isSupport?<span className="rounded-full bg-brand-red/15 px-2 py-0.5 text-[10px] font-bold text-brand-red-bright">официальный</span>:null}</div><div className="truncate text-sm text-ink-muted">{chat.last}</div></div><ChevronRight className="h-4 w-4 text-ink-muted"/></button>)}</div>}</div>;
}
