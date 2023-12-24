export const Pagination = ({ walks, page }: { walks: any; page: any }) =>
  walks?.[1] > 1 && (
    <div className="flex justify-between mt-2">
      <button
        className={`flex bg-blue-500 hover:bg-blue-700 text-black dark:text-white border font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${
          page.value === 1 && "text-bodydark2 dark:text-form-strokedark"
        }`}
        disabled={page.value === 1}
        onClick={() => page.value--}
      >
        Prev.
      </button>

      <div className="hidden min-[425px]:block m-auto">
        <div className="flex gap-4 m-auto">
          {page.value >= 2 && (
            <>
              {page.value - 2 !== 0 && (
                <span
                  className="border h-7 w-7 rounded-[50%] text-center dark:text-white cursor-pointer"
                  onClick={() => (page.value = page.value - 2)}
                >
                  {page.value - 2}
                </span>
              )}
              <span
                className="border h-7 w-7 rounded-[50%] text-center dark:text-white cursor-pointer"
                onClick={() => page.value--}
              >
                {page.value - 1}
              </span>
            </>
          )}

          <span className="border h-7 w-7 rounded-[50%] text-center dark:text-meta-5 text-black-2">
            {page.value}
          </span>

          {walks?.[1] !== page.value && (
            <>
              <span
                className="border h-7 w-7 rounded-[50%] text-center dark:text-white cursor-pointer"
                onClick={() => page.value++}
              >
                {page.value + 1}
              </span>

              {!(walks?.[1] - 1 && page.value === walks?.[1] - 1) && (
                <span
                  className="border h-7 w-7 rounded-[50%] text-center dark:text-white cursor-pointer"
                  onClick={() => (page.value = page.value + 2)}
                >
                  {page.value + 2}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <button
        className={`flex bg-blue-500 hover:bg-blue-700 text-black dark:text-white border font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${
          (walks?.[1] === page.value || !!!walks?.[0]?.length) &&
          "text-bodydark2 dark:text-form-strokedark"
        }`}
        disabled={walks?.[1] === page.value || !!!walks?.[0]?.length}
        onClick={() => page.value++}
      >
        Next
      </button>
    </div>
  );
