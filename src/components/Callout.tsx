import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import Parser from 'html-react-parser'

export default function Callout({
  type,
  title,
  description,
}: {
  type: string
  title: string
  description: string
}) {
  let bgColor = ''
  let textColor = ''

  switch (type) {
    case 'warning':
      bgColor = 'bg-yellow-50 dark:bg-yellow-900/20'
      textColor = 'text-yellow-50 dark:text-yellow-400'
      break
    case 'critical':
      bgColor = 'bg-red-50 dark:bg-red-900/20'
      textColor = 'text-red-50 dark:text-red-400'
      break
    default:
      bgColor = 'bg-blue-50 dark:bg-blue-900/20'
      textColor = 'text-blue-700 dark:text-blue-400'
  }

  return (
    <div className={`rounded-md p-4 ` + bgColor}>
      <div className="flex">
        <div className="mt-0.5 flex-shrink-0">
          {type == 'warning' ? (
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          ) : type == 'critical' ? (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          ) : (
            <InformationCircleIcon
              className="h-5 w-5 text-blue-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`m-0 text-sm font-medium ` + textColor}>{title}</h3>
          <div className={`mt-2 text-sm ` + textColor}>
            <p className="m-0">{Parser(description)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
