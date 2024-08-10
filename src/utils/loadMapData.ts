import axios from 'axios';
import { getNameFromDisPlayName } from '.';
import token from '../modules/token_';

const loadMapData = async (lat: string, lon: string) => {
    try {
        var TOKEN = await token.fetch();

        const result = await axios.get(
            `https://gps3.binhanh.vn/api/v1/addresses/${lat}/${lon}/true/18697`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            },
        );

        const isNode = getNameFromDisPlayName(result.data.data);

        const data = {
            data: {
                type: isNode ? 'N' : 'W',
                lat: Number(lat),
                lon: Number(lon),
                name: isNode
                    ? {
                          'name:vi': `${result.data.data} |`,
                      }
                    : null,
            },
        };
        await axios.put('http://localhost:8000/api/v1/interpreter/save', data);
        console.log(lat, lon, result.data.data);
    } catch (error) {
        console.log(error);
    }
};

export default loadMapData;
