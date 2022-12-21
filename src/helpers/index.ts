// LOAD NODE MODULES
// ===========================================================================
import fetch from 'node-fetch'
import { parse, HTMLElement } from 'node-html-parser'

// LOAD OWN MODULES
// ===========================================================================
import logger from '../utils/logger'

// INTERFACES
// ===========================================================================
interface IURLInfo {
    title: string
    contentLength: number
    articleUrl: string
    published: Date
}

const getAndFetchURLHTMl = async (url: string): Promise<string> => {

    try {
        // Fetch the HTML from the URL
        const res = await fetch(url)
        const html = await res.text()
        return html

    } catch (error) {
        logger.error('Errors whiling fetching URL...')
        logger.error(error)
        return ''
    }

}

const getHTMLTitle = (html: HTMLElement): string => {

    const title = html.querySelector('title')

    if (!title?.text) {
        logger.debug(`getHTMLTitle failed!. Reason: Can't find the title from this HTML`)
        throw new Error()
    }
    else {
        return title.text
    }

}

// This function calculates the number of words in the content of an HTMLElement
// by removing script and style elements, and decoding HTML entities.
const getContentLength = (html: HTMLElement): number => {

    // Remove all script elements from the html element
    html.querySelectorAll('script').forEach(el => el.remove())

    // Remove all style elements from the html element
    html.querySelectorAll('style').forEach(el => el.remove())

    // Remove all HTML tags and decode HTML entities in the html element's text
    const text = html.text.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, match => {
        switch (match) {
            case '&nbsp;':
                return ' '
            default:
                return match
        }
    })

    // Split the text into an array of words and return the length of the array
    return text.split(/\s+/).length

}


export const fetchURLInfo = async (url: string): Promise<IURLInfo> => {

    const html = await getAndFetchURLHTMl(url)
    
    // Parse the HTML and find the title element
    const root = parse(html).querySelector('html')
    if (!root) {
        logger.debug(`getHTMLTitle failed!. Reason: HTML input is empty`)
        throw { statusCode: 400, code: 'error-invalid-request' }
    }

    const title = getHTMLTitle(root)
    const contentLength = getContentLength(root)

    return {
        title,
        contentLength,
        articleUrl: url,
        published: new Date()
    }
}