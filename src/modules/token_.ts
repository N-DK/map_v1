import axios from 'axios';

let TOKEN = '';

const token = {
    fetch: async () => {
        if (TOKEN !== '') return TOKEN;
        try {
            console.log('>>> Fetching token');

            const result = await axios.post(
                'https://gps3.binhanh.vn/api/v1/authentication/login',
                {
                    UserName: 'maianhla',
                    Password: '12341234',
                    IPClient: '115.73.217.126',
                    AppType: 0,
                    ClientType: 1,
                },
            );
            TOKEN = result.data.data?.['9'];
            console.log('>>> Fetched token');
        } catch (error) {
            console.log(error);
        }
    },

    reload: () => {
        // 180 minutes
        setInterval(async () => {
            TOKEN = '';
            await token.fetch();
        }, 180 * 60 * 1000);
    },
};

export default token;
