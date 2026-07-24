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

import { Box, Chip, Stack, Typography } from '@wso2/oxygen-ui'
import { Clock, Lock, Paperclip, Shield, User } from '@wso2/oxygen-ui-icons-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import type { GrievanceActorRole, GrievanceTimelineEntry } from '../../../types/grievance'
import { formatIsoDateTime } from '../../../utils/dateTime'
import { getGrievanceStatusLabelKey } from '../utils/grievanceDisplay'

interface GrievanceActivityFeedProps {
  entries: GrievanceTimelineEntry[]
  viewerRole: Extract<GrievanceActorRole, 'DataPrincipal' | 'GrievanceOfficer'>
}

const ACTIVITY_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

const TIMELINE_MARKER_COLUMN_WIDTH = 24
const TIMELINE_LOG_DOT_SIZE = 8
const TIMELINE_COMMENT_DOT_SIZE = 10

function isLogEntry(entry: GrievanceTimelineEntry): boolean {
  return (
    entry.type === 'systemAcknowledgement' ||
    entry.type === 'statusChange' ||
    entry.type === 'resolution'
  )
}

function getEntryHeadline(entry: GrievanceTimelineEntry, t: TFunction<'common'>): string {
  if (entry.fromStatus && entry.toStatus) {
    return t('grievances.timeline.statusChangeMessage', {
      from: t(`grievances.status.${getGrievanceStatusLabelKey(entry.fromStatus)}`),
      to: t(`grievances.status.${getGrievanceStatusLabelKey(entry.toStatus)}`),
    })
  }

  return entry.message
}

function GrievanceActivityFeed({
  entries,
  viewerRole,
}: GrievanceActivityFeedProps): React.JSX.Element {
  const { t } = useTranslation('common')

  const visibleEntries = (
    viewerRole === 'DataPrincipal'
      ? entries.filter((entry) => entry.visibility === 'shared')
      : entries
  )
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  function renderTimelineMarker(dotColor: string | null, dotSize: number, dotTop: number) {
    return (
      <Box sx={{ width: TIMELINE_MARKER_COLUMN_WIDTH, flexShrink: 0, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '2px',
            bgcolor: 'divider',
            transform: 'translateX(-50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: dotTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            zIndex: 1,
            ...(dotColor
              ? { bgcolor: dotColor }
              : { bgcolor: 'background.paper', border: '1.5px solid', borderColor: 'divider' }),
          }}
        />
      </Box>
    )
  }

  function renderTimelineLogRow(entry: GrievanceTimelineEntry) {
    return (
      <Stack key={entry.id} direction="row" alignItems="stretch">
        {renderTimelineMarker(null, TIMELINE_LOG_DOT_SIZE, 11)}
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', color: 'text.secondary', flexShrink: 0 }}>
            <Clock size={13} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {getEntryHeadline(entry, t)} &middot;{' '}
            {formatIsoDateTime(entry.timestamp, ACTIVITY_DATE_FORMAT_OPTIONS)}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  function renderTimelineCommentRow(entry: GrievanceTimelineEntry) {
    const isInternal = entry.visibility === 'internal'
    const isFromDataPrincipal = entry.actorRole === 'DataPrincipal'
    const isFromOfficer = entry.actorRole === 'GrievanceOfficer' && !isInternal
    const isOfficerActor = entry.actorRole === 'GrievanceOfficer'
    const accentColor = isFromDataPrincipal ? 'primary.main' : 'info.main'

    return (
      <Stack key={entry.id} direction="row" alignItems="stretch">
        {renderTimelineMarker(accentColor, TIMELINE_COMMENT_DOT_SIZE, 13)}
        <Box sx={{ flex: 1, minWidth: 0, pt: 0.5, pb: 1.5 }}>
          <Box
            sx={(theme) => ({
              px: 2,
              py: 1.5,
              borderRadius: 1.5,
              borderLeft: 3,
              borderLeftStyle: isInternal ? 'dashed' : 'solid',
              borderLeftColor: accentColor,
              bgcolor: 'action.hover',
              ...(isFromDataPrincipal
                ? {
                    ...theme.applyStyles('light', { bgcolor: 'rgba(237, 108, 2, 0.08)' }),
                    ...theme.applyStyles('dark', { bgcolor: 'rgba(255, 167, 38, 0.12)' }),
                  }
                : {
                    ...theme.applyStyles('light', { bgcolor: 'rgba(2, 136, 209, 0.08)' }),
                    ...theme.applyStyles('dark', { bgcolor: 'rgba(41, 182, 246, 0.12)' }),
                  }),
            })}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              useFlexGap
              spacing={1}
            >
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                {isInternal ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<Lock size={11} />}
                    label={t('grievances.activity.internalTag')}
                    sx={{
                      height: 18,
                      borderColor: 'info.main',
                      color: 'info.main',
                      '& .MuiChip-icon': { color: 'info.main' },
                      '& .MuiChip-label': { px: 0.75, fontSize: 11 },
                    }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', color: accentColor, flexShrink: 0 }}>
                    {isFromOfficer ? <Shield size={15} /> : <User size={15} />}
                  </Box>
                )}
                <Typography variant="body2" fontWeight={700}>
                  {entry.actorName}
                </Typography>
                {isOfficerActor ? (
                  <Typography variant="caption" color="text.secondary">
                    {t('grievances.activity.officerRoleLabel')}
                  </Typography>
                ) : null}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {formatIsoDateTime(entry.timestamp, ACTIVITY_DATE_FORMAT_OPTIONS)}
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
              {entry.message}
            </Typography>

            {entry.attachments && entry.attachments.length > 0 ? (
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {entry.attachments.map((attachment) => (
                  <Chip
                    key={attachment.id}
                    size="small"
                    variant="outlined"
                    icon={<Paperclip size={12} />}
                    label={attachment.fileName}
                  />
                ))}
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Stack>
    )
  }

  function renderTimelineRow(entry: GrievanceTimelineEntry) {
    return isLogEntry(entry) ? renderTimelineLogRow(entry) : renderTimelineCommentRow(entry)
  }

  return <Stack spacing={0}>{visibleEntries.map((entry) => renderTimelineRow(entry))}</Stack>
}

export default GrievanceActivityFeed
