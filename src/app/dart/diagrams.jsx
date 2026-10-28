import LearningWorkflow from './learning-workflows';
import WorkforceWorkflow from './workforce-workflows';
import OperationsWorkflow from './operations-workflows';
import ReviewedWorkflow from './reviewed-workflows';

export default function DartDiagram({kind}) {
 if(kind.startsWith('learn-'))return <LearningWorkflow kind={kind}/>;
 if(kind.startsWith('workforce-'))return <WorkforceWorkflow kind={kind}/>;
 if(kind.startsWith('ops-'))return <OperationsWorkflow kind={kind}/>;
 return <ReviewedWorkflow kind={kind}/>;
}
