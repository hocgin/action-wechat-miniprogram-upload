export function getPackageName(name: string): string {
    if (name === '__FULL__') {
        return '整包';
    } else if (name === '__APP__') {
        return '主包';
    } else {
        return '分包';
    }
}

export async function getLastCommitLog(gitProject: string): Promise<any> {
    return '-';
}

export function getFormatFileSize(bytes: number) {
    if (bytes === 0) {
        return {
            size: 0,
            measure: 'Bytes',
        };
    }

    bytes *= 1024;

    const K = 1024;
    const MEASURE = ['', 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(K));

    return {
        size: parseFloat((bytes / Math.pow(K, i)).toFixed(2)),
        measure: MEASURE[i],
    };
}
