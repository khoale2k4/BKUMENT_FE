
import AllSubjectSuggestionPage from '@/screens/subjectSuggestion/AllSubjectSuggestionPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Subject Suggestions | VBook",
    description: "View and manage subject suggestions",
};


export default async function SubjectSuggestionPage() {
    return (
        <AllSubjectSuggestionPage/>
    );
}
