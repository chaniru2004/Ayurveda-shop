import { DoshaResultModel } from '../model/DoshaResultModel.js';

export class QuizService {
    calculateDosha(answers) {
        const counts = { vata: 0, pitta: 0, kapha: 0 };
        Object.values(answers).forEach(val => {
            if (counts[val] !== undefined) counts[val]++;
        });

        let dominant = 'vata';
        if (counts.pitta >= counts.vata && counts.pitta >= counts.kapha) dominant = 'pitta';
        if (counts.kapha >= counts.vata && counts.kapha >= counts.pitta) dominant = 'kapha';

        const map = {
            vata: new DoshaResultModel('vata', 'Vata Prakriti (Air & Ether)', 'Characterized by quick movement, creativity, and alertness. Balance yourself with warming herbs.', 'ashwagandha-ksm66'),
            pitta: new DoshaResultModel('pitta', 'Pitta Prakriti (Fire & Water)', 'Driven by strong focus, high metabolism, and warmth. Balance with cooling herbs.', 'kumkumadi-saffron-oil'),
            kapha: new DoshaResultModel('kapha', 'Kapha Prakriti (Earth & Water)', 'Grounded, strong, patient, and calm. Invigorate with Tulsi and spices.', 'tulsi-holy-basil-tea')
        };

        return map[dominant];
    }
}
