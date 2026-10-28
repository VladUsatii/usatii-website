import DartDocument from './document';
import {getDartPage} from '@/lib/dart/content';
export const metadata={title:'DART | Usatii for Emergency Management',description:'Learn how DART prepares people for emergency work and follows each deployment. Explore its federal capabilities.',alternates:{canonical:'/dart'},openGraph:{title:'DART | Usatii for Emergency Management',description:'Usatii for Emergency Management. Prepare the workforce and follow each deployment.',url:'/dart',type:'website'}};
export default function DartPage(){return <DartDocument page={getDartPage()}/>;}
