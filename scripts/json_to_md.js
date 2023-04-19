const fs = require('node:fs/promises');

// TODO: Instead of making exceptions about files that exist without a JSON equivalent, reverse-engineer the Markdown files to JSON so that all YYYY-MM.md files are generated every time.
const MARKDOWN_FILES_TO_LINK = [
    '2022-09',
    '2022-10',
    '2022-11',
    '2022-12',
    '2023-01',
    '2023-02',
];

const MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
];

const JSON_FOLDER = 'json';
const MARKDOWN_EXTENSION = '.md';
const README_FILENAME = 'README';

const MARKDOWN_TABLE_HEAD = `| Joueur | Score |\n| - | - |`;
const MARKDOWN_BACK = '[Retour](/README.md)';
const MARKDOWN_MORE_INFO = "[Plus d'information.](./NOTES.md)";

async function writeReadme(jsonList) {
    const path = `${README_FILENAME}${MARKDOWN_EXTENSION}`;
    console.log(`Writing file '${path}'...`);
    const markdownContent = writeMarkdownReadmeFromTemplate(jsonList);
    await fs.writeFile(path, markdownContent);
}

function writeMarkdownReadmeFromTemplate(jsonList) {
    const row = [
        ...jsonList,
        ...MARKDOWN_FILES_TO_LINK.map((fileName) => ({ fileName })),
    ]
        .sort((a, b) =>
            a.fileName > b.fileName ? 1 : b.fileName > a.fileName ? -1 : 0
        )
        .reverse()
        .map(
            (json) =>
                `* [${formatDate(json.fileName)}](./${
                    json.fileName
                }${MARKDOWN_EXTENSION})`
        )
        .join('\n');

    const markdownContent = `${row}

${MARKDOWN_MORE_INFO}
`;

    return markdownContent;
}

async function writeMarkdownFiles(jsonList) {
    try {
        for (fileData of jsonList) {
            const path = `${fileData.fileName}${MARKDOWN_EXTENSION}`;
            console.log(`Writing file '${path}'...`);
            const markdownContent = writeMarkdownScoreFromTemplate(fileData);
            await fs.writeFile(path, markdownContent);
        }
    } catch (error) {
        console.error(error);
    }
}

function writeMarkdownScoreFromTemplate(fileData) {
    const row = fileData.json
        .map((rowData) => `| ${rowData.PlayerName} | ${rowData.Score} |`)
        .join('\n');

    const markdownContent = `# ${formatDate(fileData.fileName)}

${MARKDOWN_TABLE_HEAD}
${row}

${MARKDOWN_BACK}
`;

    return markdownContent;
}

function formatDate(yyyyMMDate) {
    if (!yyyyMMDate) {
        return '';
    }

    const splittedDate = yyyyMMDate.split('-');
    if (splittedDate.length !== 2) {
        console.warn(`Unexpected date: '${yyyyMMDate}'`);
        return yyyyMMDate;
    }

    const [year, month] = splittedDate;
    return `${MONTHS[month - 1]} ${year}`;
}

async function getJsonFiles() {
    try {
        console.log(`Getting list of files in '${JSON_FOLDER}' folder...`);
        // TODO: Only keep JSON files formatted as YYYY-MM.
        const fileList = await fs.readdir(JSON_FOLDER);
        const fileListData = [];

        for (const fileName of fileList) {
            const path = `${JSON_FOLDER}/${fileName}`;
            console.log(`Parsing file '${path}'...`);
            const fileContent = await fs.readFile(path);
            const json = JSON.parse(fileContent);
            fileListData.push({
                fileName: removeFileExtension(fileName),
                json,
            });
        }

        return fileListData;
    } catch (error) {
        console.error(error);
    }
}

function removeFileExtension(string) {
    return string.replace(/\.[^/.]+$/, '');
}

async function main() {
    const files = await getJsonFiles();

    if (files) {
        await writeMarkdownFiles(files);
        writeReadme(files);
        return;
    }

    console.warn('No file found.');
}

main();
