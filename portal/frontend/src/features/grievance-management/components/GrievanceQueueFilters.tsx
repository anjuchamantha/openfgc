/*
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@wso2/oxygen-ui'
import { Search } from '@wso2/oxygen-ui-icons-react'
import { useTranslation } from 'react-i18next'
import { GRIEVANCE_PRIORITIES, GRIEVANCE_STATUSES } from '../../../types/grievance'
import { getGrievanceStatusLabelKey } from '../../grievances/utils/grievanceDisplay'
import type { GrievanceQueueFiltersState } from '../types'

interface GrievanceQueueFiltersProps {
  filters: GrievanceQueueFiltersState
  onFilterChange: (nextFilters: GrievanceQueueFiltersState) => void
  onClear: () => void
}

function GrievanceQueueFilters({
  filters,
  onFilterChange,
  onClear,
}: GrievanceQueueFiltersProps): React.JSX.Element {
  const { t } = useTranslation('common')

  return (
    <Box
      component="section"
      aria-label={t('grievances.management.queue.filters.sectionAriaLabel')}
      sx={(theme) => ({
        p: { xs: 1.5, sm: 2 },
        borderRadius: 1,
        ...theme.applyStyles('light', { bgcolor: theme.palette.grey[50] }),
        ...theme.applyStyles('dark', { bgcolor: 'rgba(255, 255, 255, 0.04)' }),
      })}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 1.5, lg: 2 }}
        alignItems={{ lg: 'center' }}
      >
        <FormControl size="small" sx={{ width: { xs: '100%', lg: 'auto' }, minWidth: { lg: 180 } }}>
          <InputLabel id="grievance-queue-status-label">
            {t('grievances.management.queue.filters.status')}
          </InputLabel>
          <Select
            labelId="grievance-queue-status-label"
            id="grievance-queue-status"
            value={filters.status}
            label={t('grievances.management.queue.filters.status')}
            onChange={(event) => {
              onFilterChange({
                ...filters,
                status: event.target.value as GrievanceQueueFiltersState['status'],
              })
            }}
          >
            <MenuItem value="All">{t('grievances.management.queue.filters.all')}</MenuItem>
            {GRIEVANCE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {t(`grievances.status.${getGrievanceStatusLabelKey(status)}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: { xs: '100%', lg: 'auto' }, minWidth: { lg: 160 } }}>
          <InputLabel id="grievance-queue-priority-label">
            {t('grievances.management.queue.filters.priority')}
          </InputLabel>
          <Select
            labelId="grievance-queue-priority-label"
            id="grievance-queue-priority"
            value={filters.priority}
            label={t('grievances.management.queue.filters.priority')}
            onChange={(event) => {
              onFilterChange({
                ...filters,
                priority: event.target.value as GrievanceQueueFiltersState['priority'],
              })
            }}
          >
            <MenuItem value="All">{t('grievances.management.queue.filters.all')}</MenuItem>
            {GRIEVANCE_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {t(`grievances.priority.${priority}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder={t('grievances.management.queue.filters.search')}
          size="small"
          value={filters.search}
          onChange={(event) => {
            onFilterChange({ ...filters, search: event.target.value })
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ display: 'flex', mr: 1, color: 'text.secondary' }}>
                  <Search size={16} />
                </Box>
              ),
            },
            htmlInput: {
              'aria-label': t('grievances.management.queue.filters.search'),
            },
          }}
          sx={{ width: { xs: '100%', lg: 'auto' }, flex: { lg: 1 }, minWidth: { lg: 220 } }}
        />

        <Button
          variant="text"
          onClick={onClear}
          aria-label={t('grievances.management.queue.filters.clearAriaLabel')}
          sx={{ width: { xs: '100%', lg: 'auto' } }}
        >
          {t('grievances.management.queue.filters.clear')}
        </Button>
      </Stack>
    </Box>
  )
}

export default GrievanceQueueFilters
