const getNameFromDisPlayName = (displayName: string) => {
    const res = displayName.split(',').length;
    // const regex = /^(X. |P. |H. |TT. |TP. )/;
    // if (regex.test(res)) {
    //     return null;
    // }
    // return res;
    return res >= 4;
};

const checkCommonString = (str1: string, str2: string): boolean => {
    const string1 = str1;
    const string2 = str2;

    const words1 = string1?.split(/\s+/);
    const words2 = string2?.split(/\s+/);

    const words2Set = new Set(words2.map((word) => word.toLowerCase()));

    const commonWordCount = words1.reduce((count, word1) => {
        if (words2Set.has(word1.toLowerCase())) {
            return count + 1;
        }
        return count;
    }, 0);

    const hasAtLeastTwoCommonWords = commonWordCount >= 3;

    return hasAtLeastTwoCommonWords;
};

function isNumeric(value: any) {
    return /^-?\d+$/.test(value);
}

export { getNameFromDisPlayName, isNumeric, checkCommonString };
