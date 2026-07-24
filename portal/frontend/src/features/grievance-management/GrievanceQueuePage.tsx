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

import { Box, Stack, StatCard, Typography } from '@wso2/oxygen-ui'
import { AlertTriangle, CheckCircle2, Clock3, Inbox } from '@wso2/oxygen-ui-icons-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import HeaderBreadcrumbs from '../../components/layout/main-layout/HeaderBreadcrumbs'
import type { GrievanceStatus } from '../../types/grievance'
import { MOCK_GRIEVANCES } from '../grievances/data/mockGrievances'
import { getGrievanceSlaState } from '../grievances/utils/grievanceDisplay'
import GrievanceQueueFilters from './components/GrievanceQueueFilters'
import GrievanceQueueTable from './components/GrievanceQueueTable'
import type { GrievanceQueueFiltersState } from './types'

const OPEN_STATUSES: GrievanceStatus[] = ['Open', 'Investigation', 'WaitingOnDpo']

const DEFAULT_FILTERS: GrievanceQueueFiltersState = {
  status: 'All',
  priority: 'All',
  search: '',
}

const CLOSED_OUT_STATUSES: GrievanceStatus[] = ['Resolved']

function GrievanceQueuePage(): React.JSX.Element {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [filters, setFilters] = useState<GrievanceQueueFiltersState>(DEFAULT_FILTERS)

  const stats = useMemo(() => {
    const openCount = MOCK_GRIEVANCES.filter((grievance) =>
      OPEN_STATUSES.includes(grievance.status),
    ).length
    const awaitingInfoCount = MOCK_GRIEVANCES.filter(
      (grievance) => grievance.status === 'AwaitingInfo',
    ).length
    const resolvedCount = MOCK_GRIEVANCES.filter(
      (grievance) => grievance.status === 'Resolved',
    ).length
    const slaBreachedCount = MOCK_GRIEVANCES.filter(
      (grievance) =>
        getGrievanceSlaState(grievance.statutoryDueDate, grievance.status) === 'breached',
    ).length

    return { openCount, awaitingInfoCount, resolvedCount, slaBreachedCount }
  }, [])

  const rows = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return MOCK_GRIEVANCES.filter((grievance) => {
      if (filters.status !== 'All' && grievance.status !== filters.status) {
        return false
      }

      if (filters.status === 'All' && CLOSED_OUT_STATUSES.includes(grievance.status)) {
        return false
      }

      if (filters.priority !== 'All' && grievance.priority !== filters.priority) {
        return false
      }

      return !(
        search &&
        !grievance.referenceId.toLowerCase().includes(search) &&
        !grievance.dataPrincipalName.toLowerCase().includes(search)
      )
    }).sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    )
  }, [filters])

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <HeaderBreadcrumbs />
          <Typography variant="h4" fontWeight={700}>
            {t('grievances.management.queue.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('grievances.management.queue.subtitle')}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          <StatCard
            value={stats.openCount}
            label={t('grievances.management.queue.stats.open')}
            icon={<Inbox size={22} />}
            iconColor="info"
          />
          <StatCard
            value={stats.awaitingInfoCount}
            label={t('grievances.management.queue.stats.awaitingInfo')}
            icon={<Clock3 size={22} />}
            iconColor="warning"
          />
          <StatCard
            value={stats.resolvedCount}
            label={t('grievances.management.queue.stats.resolved')}
            icon={<CheckCircle2 size={22} />}
            iconColor="success"
          />
          <StatCard
            value={stats.slaBreachedCount}
            label={t('grievances.management.queue.stats.slaBreached')}
            icon={<AlertTriangle size={22} />}
            iconColor="error"
          />
        </Box>

        <GrievanceQueueFilters
          filters={filters}
          onFilterChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        {rows.length === 0 ? (
          <Typography>{t('grievances.management.queue.empty')}</Typography>
        ) : (
          <GrievanceQueueTable
            rows={rows}
            onViewCase={(id) => navigate(`/grievance-management/${encodeURIComponent(id)}`)}
          />
        )}
      </Stack>
    </Box>
  )
}

export default GrievanceQueuePage
