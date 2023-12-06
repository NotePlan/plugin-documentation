import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

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
      bgColor = 'bg-yellow-'
      textColor = 'text-yellow-'
      break
    case 'critical':
      bgColor = 'bg-red-'
      textColor = 'text-red-'
      break
    default:
      bgColor = 'bg-blue-'
      textColor = 'text-blue-'
  }

  return (
    <div className={`rounded-md p-4 ` + bgColor + `50`}>
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
          <h3 className={`m-0 text-sm font-medium ` + textColor + `800`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ` + textColor + `700`}>
            <p className="m-0">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
