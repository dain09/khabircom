
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { generateRecipe } from '../../services/geminiService';
import { Loader } from '../../components/ui/Loader';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { ResultCard } from '../../components/ui/ResultCard';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { useGemini } from '../../hooks/useGemini';

interface RecipeResult {
    real_recipe: { name: string; steps: string; };
    comic_recipe: { name: string; steps: string; };
    advice: string;
}

const RecipeGenerator: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'recipe-generator')!;
    const [ingredients, setIngredients] = useState('');
    const { data: result, isLoading, error, execute } = useGemini<RecipeResult, string>(generateRecipe);

    const handleSubmit = () => {
        if (!ingredients.trim()) return;
        execute(ingredients);
    };

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="اكتب المكونات اللي عندك في التلاجة، مهما كانت بسيطة، والخبير هيخترعلك بيها أكلة بجد وأكلة تانية كوميدية."
        >
            <div className="space-y-4">
                 <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="اكتب المكونات اللي في تلاحتك، زي: بيض، طماطم، جبنة..."
                    className="w-full p-3 bg-white/20 dark:bg-dark-card/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-lg rounded-bl-none focus:ring-2 focus:ring-primary focus:outline-none transition-colors shadow-inner placeholder:text-slate-500 dark:placeholder:text-slate-400/60"
                />
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={!ingredients.trim()}>
                    اخترعلي أكلة
                </Button>
            </div>
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {result && (
                <div className="mt-6 space-y-4">
                    <ResultCard 
                        title={`وصفة بجد: ${result?.real_recipe?.name}`}
                        copyText={`${result?.real_recipe?.name}\n\n${result?.real_recipe?.steps}`}
                    >
                       <p>{result?.real_recipe?.steps}</p>
                    </ResultCard>
                    <ResultCard 
                        title={`وصفة فكاهية: ${result?.comic_recipe?.name}`}
                        copyText={`${result?.comic_recipe?.name}\n\n${result?.comic_recipe?.steps}`}
                    >
                       <p>{result?.comic_recipe?.steps}</p>
                    </ResultCard>
                    <ResultCard title="نصيحة الشيف 🧑‍🍳" copyText={result?.advice}>{result?.advice}</ResultCard>
                </div>
            )}
        </ToolContainer>
    );
};

export default RecipeGenerator;
