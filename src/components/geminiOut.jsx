import { useEffect } from 'react';
import { use_federal_deputies } from '../hooks/useGemini';

export default function GeminiOut({ stateName }) {
    const { 
        data: deputiesData, 
        is_loading: deputiesLoading, 
        error: deputiesError, 
        fetch_federal_deputies 
    } = use_federal_deputies();

    useEffect(() => {
        if (stateName) {
            fetch_federal_deputies(stateName);
        }
    }, [stateName, fetch_federal_deputies]);

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Informações Geradas por IA (Gemini)</h2>
            
            <div>
                <h3>Deputados Federais</h3>
                {deputiesLoading && <p>Carregando dados sobre os deputados...</p>}
                {deputiesError && <p style={{ color: 'red' }}>Erro: {deputiesError}</p>}
                {deputiesData && <div dangerouslySetInnerHTML={{ __html: deputiesData }} />}
            </div>
        </div>
    );
}
