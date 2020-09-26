import React from 'react';
import { DataTable } from '../../lib';
import { CommonColumns } from '../columns';
import { DataState, onQueryChange, Pokemon, query, sqliteParams } from '../db';

export function FullFeaturedExample() {
  const [staticData, setStaticData] = React.useState<DataState>({list: [], total: 0, loading: true});
  
  return <DataTable<Pokemon>
    id='pokemon'
    filterSettings={{
      allowOr: true,
      allowNested: true,
      limitOneColumnUse: true,
    }}
    fixedColBg='var(--dt-fixed-bg, white)'
    defaultSort={[
      {column: 'id', direction: 'asc'}
    ]}
    multiColumnSorts={true}
    canReorderColumns={true}
    paginateOptions={{
      buttonPosition: 'split',
      showFirstLast: true,
      perPageOptions: 'any',
    }}
    quickEditPosition='top'
    onSaveQuickEdit={async (data) => {
      // loop through and save or craft single update
      for (let primaryKey of Object.keys(data)) {
        let updateSqls = Object.keys(data[primaryKey]).map(field => `${field} = :${field}`);
        let sql = `UPDATE pokemon SET ${updateSqls.join(', ')} WHERE id = :id;`;
        query(sql, sqliteParams({
          ...data[primaryKey],
          id: primaryKey,
        }));
      }
    }}
    canEditRow={(data) => data.id !== 7}
    DetailRow={({parentRow}) => <div>Detail row for {parentRow.name} goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis commodo purus eget vehicula. Duis sodales sem orci, et pulvinar neque lacinia ut. Fusce in massa vel lorem consequat maximus nec ac lectus. In in elementum nulla. Quisque odio purus, euismod sed ullamcorper commodo, ullamcorper in ligula. Fusce sollicitudin pretium diam a facilisis. In fermentum, lectus quis efficitur suscipit, justo elit fermentum velit, in aliquet massa nisi suscipit ligula. Etiam volutpat id nulla at eleifend. Nulla tristique tellus ipsum, in gravida mauris ornare et. Mauris aliquet blandit risus ac ornare.</div>}
    canRowShowDetail={(data) => data.id !== 4}

    columns={CommonColumns}

    onQueryChange={(queryProps) => onQueryChange(queryProps, setStaticData)} // Notifies of filter/pagination/search/sort changes
    data={staticData.list} // Pass Data in directly
    totalCount={staticData.total} // Total count to enable pagination
    isLoading={staticData.loading} // Allows external to show loading indicator
  />
}