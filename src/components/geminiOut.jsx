import { useEffect } from 'react';
import { use_federal_deputies, use_city_councilors } from '../hooks/useGemini';

export default function GeminiOut({ stateName }) {
    const { 
        data: deputiesData, 
        is_loading: deputiesLoading, 
        error: deputiesError, 
        fetch_federal_deputies 
    } = use_federal_deputies();

    const { 
        data: councilorsData, 
        is_loading: councilorsLoading, 
        error: councilorsError, 
        fetch_city_councilors 
    } = use_city_councilors();

    useEffect(() => {
        if (stateName) {
            fetch_federal_deputies(stateName);
            fetch_city_councilors(stateName);
        }
    }, [stateName, fetch_federal_deputies, fetch_city_councilors]);

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Informações Geradas por IA (Gemini)</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>Deputados Federais</h3>
                {deputiesLoading && <p>Carregando dados sobre os deputados...</p>}
                {deputiesError && <p style={{ color: 'red' }}>Erro: {deputiesError}</p>}
                {deputiesData && <div dangerouslySetInnerHTML={{ __html: deputiesData }} />}
            </div>

            <div>
                <h3>Total de Vereadores</h3>
                {councilorsLoading && <p>Carregando dados sobre os vereadores...</p>}
                {councilorsError && <p style={{ color: 'red' }}>Erro: {councilorsError}</p>}
                {councilorsData && <div dangerouslySetInnerHTML={{ __html: councilorsData }} />}
            </div>
        </div>
    );
}
