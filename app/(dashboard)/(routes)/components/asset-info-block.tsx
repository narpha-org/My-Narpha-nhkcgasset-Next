import React from 'react'

const AssetInfoBlock = () => {
  return (
    <>
      <div v-if="title" className="block text-lg font-semibold py-2 px-2">
        <i className="title_icon" />
        アセット情報
      </div>
      <div className="flex-grow h-full overflow-y-auto">
        <slot>
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
          ああああああああああ
        </slot>
      </div>
    </>
  )
}

export default AssetInfoBlock