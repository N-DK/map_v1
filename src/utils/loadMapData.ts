import axios from 'axios';
import { getNameFromDisPlayName } from '.';

const TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMmFmNDkwMS1iOTNmLTRiYmUtODAyNi1hZmY4MjU3ZjA2YzIiLCJpYXQiOiIxNzIzMjg1Nzc0MDYzIiwic3ViIjoiYzcxNGNjN2EtYzAwZC00NzFmLThkNmMtMjA3YmViMjI1ZDA3IiwiWG5Db2RlIjoiMjU1MiIsIkN1c3RvbWVyQ29kZSI6IiIsImV4cCI6MTcyMzI3NDk3NCwiaXNzIjoiMTAuMC4xMC42OCJ9.Ec9o9n4O-mgazgNbWMf0N7qnbWF6RvGqz8-iPo3lM_k';

const loadMapData = async (lat: string, lon: string) => {
    try {
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
