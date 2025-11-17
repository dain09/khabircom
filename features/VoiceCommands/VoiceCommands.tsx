
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Mic, MicOff } from 'lucide-react';
import { ToolContainer } from '../../components/ToolContainer';
import { TOOLS } from '../../constants';
import { ResultCard } from '../../components/ui/ResultCard';

const VoiceCommands: React.FC = () => {
    const toolInfo = TOOLS.find(t => t.id === 'voice-commands')!;
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState('دوس على المايك واتكلم...');

    const handleListen = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatus('للأسف، متصفحك مش بيدعم الميزة دي.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-EG';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setStatus('سامعك... قول اللي انت عايزه');
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            setStatus('تمام، حولت صوتك لنص. الرد التلقائي لسه تحت التطوير.');
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setStatus(`حصل خطأ: ${event.error === 'no-speech' ? 'مسمعتش حاجة' : event.error}`);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
             if(status === 'سامعك... قول اللي انت عايزه') {
                setStatus('خلصت استماع. دوس تاني عشان تتكلم.');
            }
        };
        
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }

    }, [isListening, status]);

    return (
        <ToolContainer 
            title={toolInfo.title} 
            description={toolInfo.description} 
            icon={toolInfo.icon} 
            iconColor={toolInfo.color}
            introText="دوس على زرار المايك واتكلم. الخبير هيحول صوتك لنص. (ملحوظة: الميزة دي لسه تجريبية)."
        >
            <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
                <Button
                    onClick={handleListen}
                    className={`w-24 h-24 rounded-full transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
                >
                    {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                </Button>
                <p className="text-lg font-semibold h-6">{status}</p>
                <p className="text-sm text-gray-500">ملحوظة: الميزة دي تجريبية وممكن متشتغلش على كل المتصفحات.</p>
            </div>
            {transcript && (
                <ResultCard title="الكلام اللي اتقال">
                    <p>"{transcript}"</p>
                </ResultCard>
            )}
        </ToolContainer>
    );
};

export default VoiceCommands;
