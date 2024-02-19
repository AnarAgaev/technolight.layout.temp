import { useId } from 'react'
import { useProduct } from '../../Store'
import AccordionItem from '../AccordionItem'
import Instructions from '../Instructions'
import style from './Accordion.module.scss'

const Accordion: React.FC = () => {
    const { accordion, list, table, cellCaption, buttons, video, desc } = style

    const id = useId()

    const specifications = useProduct(state => state.series.specifications)
    const description = useProduct(state => state.series.description)
    const files = useProduct(state => state.series.files)
    const vidoes = useProduct(state => state.series.videos)

    const getSpecificationList = () => {
        if (specifications === null) return

        const specificationList: React.ReactElement[] = []

        for (const iterator in specifications) {
            specificationList.push(
                <tr key={`${id}-specification-${iterator}`}>
                    <td className={cellCaption}>{iterator}</td>
                    <td>{specifications[iterator]}</td>
                </tr>
            )
        }

        return specificationList
    }

    const getFilesList = () => {
        if (files === null) return

        const filesList: React.ReactElement[] = []

        for (const iterator in files) {
            filesList.push(
                <a key={`${id}-file-${iterator}`}
                    className="btn btn_small btn_lite btn_download"
                    href={files[iterator].url}
                    download><i></i><span>{files[iterator].name}</span>
                </a>
            )
        }

        return filesList
    }

    const hasAccordionData = specifications || description || files || vidoes

    return (
        !hasAccordionData
            ? null
            : <div className={accordion}>
                <ul className={list}>
                    {
                        specifications !== null
                            ? <AccordionItem key={`${id}-item-1`} title="Характеристики" isOpen={false}>
                                <table className={table} border={0}>
                                    <tbody>
                                        {getSpecificationList()}
                                    </tbody>
                                </table>
                            </AccordionItem>
                            : null
                    }
                    {
                        description !== null
                            ? <AccordionItem key={`${id}-item-2`} title="Описание" isOpen={false}>
                                <p className={desc} dangerouslySetInnerHTML={{ __html: description }}></p>
                            </AccordionItem>
                            : null
                    }
                    {
                        files !== null
                            ? <AccordionItem key={`${id}-item-3`} title="Файлы для скачивания" isOpen={false}>
                                <div className={buttons}>
                                    {getFilesList()}
                                </div>
                            </AccordionItem>
                            : null
                    }
                    {
                        vidoes !== null
                            ? <AccordionItem key={`${id}-item-4`} title="Видеоинструкция" isOpen={false}>
                                <div className={video}>
                                    <Instructions />
                                </div>
                            </AccordionItem>
                            : null
                    }
                </ul>
            </div>
    )
}

export default Accordion