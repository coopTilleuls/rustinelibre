{{/*
Expand the name of the chart.
*/}}
{{- define "bikelib-api.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "bikelib-api.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "bikelib-api.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "bikelib-api.labels" -}}
helm.sh/chart: {{ include "bikelib-api.chart" . }}
{{ include "bikelib-api.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Common labels PWA
*/}}
{{- define "bikelib-api.labelsPWA" -}}
helm.sh/chart: {{ include "bikelib-api.chart" . }}
{{ include "bikelib-api.selectorLabelsPWA" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "bikelib-api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bikelib-api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ include "bikelib-api.name" . }}
{{- end }}

{{/*
Selector labels PWA
*/}}
{{- define "bikelib-api.selectorLabelsPWA" -}}
app.kubernetes.io/name: {{ include "bikelib-api.name" . }}-pwa
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ include "bikelib-api.name" . }}
{{- end }}

{{/*
Selector labels Fixtures job
*/}}
{{- define "bikelib-api.selectorLabelsFixtures" -}}
app.kubernetes.io/name: {{ include "bikelib-api.name" . }}-pwa
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "bikelib-api.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "bikelib-api.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}