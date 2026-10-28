import {notFound} from 'next/navigation';
import DartDocument from '../document';
import {dartPages,getDartPage,dartHref} from '@/lib/dart/content';
export const dynamicParams=false;
export function generateStaticParams(){return dartPages.filter(p=>p.slug).map(({slug})=>({slug}));}
export async function generateMetadata({params}){const {slug}=await params;const page=getDartPage(slug);if(!page)return {};return {title:`${page.title} | DART`,description:page.description,alternates:{canonical:dartHref(slug)},openGraph:{title:`${page.title} | DART`,description:page.description,url:dartHref(slug),type:'website'}};}
export default async function DartTopicPage({params}){const {slug}=await params;const page=getDartPage(slug);if(!page)notFound();return <DartDocument page={page}/>;}
