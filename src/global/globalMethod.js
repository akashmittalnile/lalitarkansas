import { BASE_URL, OBJECT_TYPE_DETAILS } from './Service';
import Share from 'react-native-share';

export const shareItemHandler = async (type, id) => {
    try {
        const shareOptions = {
            message: 'Simple share with message',
            url: `${BASE_URL}${OBJECT_TYPE_DETAILS}/${type}/${id}`,
        };
        await Share.open(shareOptions);
    } catch (err) {
        console.log('share err', err.message);
    }
}