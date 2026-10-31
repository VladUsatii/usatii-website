'use client';
import dynamic from 'next/dynamic';
const WorkflowBoardTab = dynamic(()=>import('./genuine-workflow/components/dashboard/WorkflowBoardTab').then(module=>module.WorkflowBoardTab),{ssr:false});
import './workflow-parity.css';
export default function OperationsDashboard(){return <div className='enterprise-genuine-workflow admin-surface'><WorkflowBoardTab /></div>;}
