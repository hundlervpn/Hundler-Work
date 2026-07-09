"use client";
import * as React from "react";
import { GridIcon, ChevronDown } from "./icons";
import { CATEGORIES } from "@/lib/data";

export function CategorySelect({selected,onChange}:{selected:string[];onChange:(value:string[])=>void}){
 const[open,setOpen]=React.useState(false);
 const choices=CATEGORIES.filter(item=>item!=="Все категории");
 function toggle(value:string){onChange(selected.includes(value)?selected.filter(item=>item!==value):[...selected,value])}
 return <section className="rounded-2xl bg-card shadow-border"><button type="button" onClick={()=>setOpen(value=>!value)} className="press flex min-h-[52px] w-full items-center gap-3 px-4 text-left"><GridIcon className="h-5 w-5 text-brand-red-bright"/><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-ink">Категории</span><span className="block truncate text-xs text-ink-muted">{selected.length?selected.join(", "):"Все категории"}</span></span>{selected.length?<span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-bold text-white">{selected.length}</span>:null}<ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${open?"rotate-180":""}`}/></button>{open?<div className="border-t border-hair p-4"><div className="flex flex-wrap gap-2">{choices.map(value=><button type="button" key={value} onClick={()=>toggle(value)} className={`press rounded-full px-3.5 py-2 text-sm font-semibold shadow-border ${selected.includes(value)?"bg-brand-red text-white":"bg-raise text-ink"}`}>{value}</button>)}</div>{selected.length?<button type="button" onClick={()=>onChange([])} className="mt-4 text-xs font-bold text-ink-muted">Сбросить категории</button>:null}</div>:null}</section>;
}
