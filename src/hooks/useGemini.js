import { useState, useCallback } from 'react';
import { output_prompt_html } from '../mappers/processGemini.js';

export function use_federal_deputies() {
    const [data, set_data] = useState(null);
    const [is_loading, set_is_loading] = useState(false);
    const [error, set_error] = useState(null);

    const fetch_federal_deputies = useCallback(async (state_name) => {
        set_is_loading(true);
        set_error(null);
        try {
            
            const result = await output_prompt_html(1, state_name);
            set_data(result);
        } catch (err) {
            set_error(err.message || "Falha ao buscar deputados federais");
        } finally {
            set_is_loading(false);
        }
    }, []);

    return { data, is_loading, error, fetch_federal_deputies };
}

