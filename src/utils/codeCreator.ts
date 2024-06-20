export default function codeCreator(startingCode: string, middleCode: string, endCode: string): string {
    return `
${startingCode}

${middleCode}

${endCode}
`
}
// for python and java, endCode can be passed as empty string
