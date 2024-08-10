const convertToHStore = (data: Record<string, any>): string | null => {
    if (data === undefined || data === null) {
        return null;
    }

    return Object.keys(data)
        .map((key) => `"${key}"=>"${data[key]}"`)
        .join(', ');
};

export default convertToHStore;
