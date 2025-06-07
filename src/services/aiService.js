const axios = require('axios');
const pdfParse = require('pdf-parse');
const supabase = require('../config/supabaseClient');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const extractCVDataWithGemini = async (fileBuffer) => {
  try {
    const pdfData = await pdfParse(fileBuffer);
    const prompt = `
Analiza este currículum y extrae las habilidades técnicas, habilidades blandas y certificaciones en formato JSON. Las habilidades tienen que concordar con alguna de las siguientes categorías:
.NET MAUI (cross-platform UI) - Técnica
.NET microservices with Dapr - Técnica
ABAP OO - Técnica
AI code review - Técnica
ASP.NET Core - Técnica
AWS API Gateway - Técnica
AWS CDK (Cloud Development Kit) - Técnica
AWS CloudFormation - Técnica
AWS DynamoDB - Técnica
AWS ECS - Técnica
AWS EKS - Técnica
AWS Elastic Beanstalk - Técnica
AWS Fargate - Técnica
AWS Glue - Técnica
AWS IAM (Identity & Access Management) - Técnica
AWS Lambda - Técnica
AWS Step Functions - Técnica
AWS VPC design - Técnica
AWS/Azure/GCP - Técnica
Accessibility (WCAG 2.2) - Técnica
Accountability - Suave
Active Listening - Suave
Adaptability - Suave
Adobe XD - Técnica
Airflow - Técnica
Amazon CloudWatch - Técnica
Amazon EC2 - Técnica
Amazon Kinesis - Técnica
Amazon RDS - Técnica
Amazon Redshift - Técnica
Amazon S3 - Técnica
Amazon SNS - Técnica
Amazon SQS - Técnica
Android Jetpack Compose - Técnica
Android Studio - Técnica
Angular - Técnica
Angular Material - Técnica
Ansible - Técnica
Apache Kafka (Java client) - Técnica
Apache Superset - Técnica
Appian - Técnica
Argo CD - Técnica
Azure DevOps pipelines - Técnica
Azure Synapse Analytics - Técnica
Blazor WebAssembly - Técnica
C# 12 language features - Técnica
C/C++ - Técnica
C/C++ optimization - Técnica
CI/CD - Técnica
Cassandra - Técnica
Collaboration - Suave
Combine & Async/Await - Técnica
Conflict Resolution - Suave
Confluence Knowledge Bases - Técnica
Core Data - Técnica
Creativity & Innovation - Suave
Critical Thinking - Suave
Cross-platform Kotlin Multiplatform - Técnica
Cultural Awareness - Suave
DDD - Técnica
Dapper micro-ORM - Técnica
Decision-Making - Suave
Dependency Injection (built-in container) - Técnica
Design Systems (Storybook, Material 3) - Técnica
Docker - Técnica
ETL/ELT - Técnica
Emotional Intelligence - Suave
Empathy - Suave
Entity Framework Core - Técnica
Facilitation - Suave
Figma - Técnica
Flexibility - Suave
Flutter - Técnica
Git mastery - Técnica
GitHub Actions - Técnica
GitLab CI/CD - Técnica
Go - Técnica
Google BigQuery - Técnica
GraalVM Native Image - Técnica
Gradle - Técnica
GraphQL - Técnica
Growth Mindset - Suave
Hardhat/Foundry - Técnica
Helm Charts - Técnica
Hibernate / JPA - Técnica
Hilt & Room - Técnica
IAM - Técnica
IaC - Técnica
InfluxDB (time-series) - Técnica
Informatica PowerCenter - Técnica
Interaction & Motion Design - Técnica
JUnit & Mockito testing - Técnica
JVM GC tuning & performance - Técnica
Jakarta EE - Técnica
Java Flight Recorder - Técnica
Java/Kotlin - Técnica
Jenkins - Técnica
Jira Administration - Técnica
Kanban Flow - Técnica
Kotlin + Jetpack Compose - Técnica
Kubernetes - Técnica
LINQ mastery - Técnica
Leadership - Suave
Looker / Looker Studio - Técnica
MLOps - Técnica
Maven - Técnica
Mendix - Técnica
Mentoring & Coaching - Suave
MicroProfile - Técnica
Micronaut - Técnica
Microsoft SQL Server - Técnica
MongoDB - Técnica
MySQL / MariaDB - Técnica
Negotiation - Suave
Neo4j - Técnica
Networking - Suave
Next.js - Técnica
NuGet package management - Técnica
OKR Road-mapping - Técnica
OOP - Técnica
OWASP - Técnica
Objective-C legacy - Técnica
OpenAPI - Técnica
OpenTelemetry - Técnica
Oracle Database - Técnica
PMI / PMP framework - Técnica
PRINCE2 - Técnica
PWA patterns - Técnica
Packer - Técnica
Performance profiling (dotTrace) - Técnica
Playwright/Cypress - Técnica
PostgreSQL - Técnica
Power BI - Técnica
Power Platform - Técnica
Presentation Skills - Suave
Prioritization - Suave
Problem-Solving - Suave
Prometheus - Técnica
Public Speaking - Suave
Python - Técnica
Q# - Técnica
Qiskit - Técnica
Quarkus - Técnica
REST - Técnica
React 18 - Técnica
React Native - Técnica
React/Next.js - Técnica
Reactive Streams (Reactor / RxJava) - Técnica
Redis - Técnica
Redux Toolkit / NgRx - Técnica
Resilience - Suave
Responsive & Mobile-first Design - Técnica
Risk & Issue Management - Técnica
Roslyn analyzers & source generators - Técnica
Rust - Técnica
Rust safety - Técnica
SAFe 5.0 - Técnica
SAP BTP (Business Technology Platform) - Técnica
SAP Fiori UX - Técnica
SAP HANA modelling - Técnica
SAP Integration Suite / PI-PO - Técnica
SAP S/4HANA Extensibility - Técnica
SAP SuccessFactors - Técnica
SAP UI5 - Técnica
SAST/DAST - Técnica
SBOM - Técnica
SLO/SLA - Técnica
SQL + NoSQL tuning - Técnica
SQLite - Técnica
Scrum Mastery - Técnica
Self-Motivation - Suave
SignalR - Técnica
Site Reliability Engineering (SRE) - Técnica
Sketch - Técnica
Snowflake - Técnica
Solidity - Técnica
Spark/Flink - Técnica
Spinnaker - Técnica
Spring Boot - Técnica
Spring Framework - Técnica
Stakeholder Management - Suave
Stress Management - Suave
Svelte - Técnica
Swift - Técnica
SwiftUI - Técnica
TDD/BDD - Técnica
Tableau - Técnica
Tailwind CSS - Técnica
Talend Open Studio - Técnica
Task-based async programming - Técnica
Teamwork - Suave
Technical Writing - Suave
Terraform Modules & Workspaces - Técnica
Time Management - Suave
TypeScript - Técnica
TypeScript/JS - Técnica
UiPath - Técnica
Unity - Técnica
Unity / Prism MVVM frameworks - Técnica
Unreal - Técnica
Usability Testing - Técnica
Vue - Técnica
WPF / WinUI 3 desktop apps - Técnica
WebAssembly - Técnica
WebXR - Técnica
Webpack & Vite - Técnica
agile practices - Técnica
algorithms - Técnica
architectural writing - Técnica
async/reactive patterns - Técnica
caching - Técnica
chaos engineering - Técnica
code reviews - Técnica
communication - Técnica
complexity - Técnica
concurrency - Técnica
contract testing - Técnica
data lakes - Técnica
data structures - Técnica
dbt (Core & Cloud) - Técnica
eBPF - Técnica
edge orchestration - Técnica
embedded/IoT - Técnica
event streaming Kafka/Pulsar - Técnica
fine-tuning - Técnica
functional - Técnica
gRPC - Técnica
gRPC for .NET - Técnica
iOS SwiftUI - Técnica
incident command - Técnica
load-balancing - Técnica
memory - Técnica
micro-/event-driven services - Técnica
model lifecycle - Técnica
prompt engineering - Técnica
property tests - Técnica
responsible AI - Técnica
security audits - Técnica
shader programming - Técnica
threat modeling - Técnica
tracing - Técnica
vector DBs - Técnica
workflow orchestration - Técnica
xUnit / NUnit testing - Técnica
zero-trust - Técnica

Formato:
{
  "habilidades_tecnicas": ["skill1", "skill2"],
  "habilidades_blandas": ["habilidad1", "habilidad2"],
  "certificaciones": [
    { "nombre": "Cert1", "entidad": "Entidad1" }
  ]
}
Currículum:
${pdfData.text}
`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const raw = response.data.candidates[0].content.parts[0].text;

    // Limpiar el bloque markdown ```json ... ```
    const cleaned = raw.replace(/```json|```/g, '').trim();

    // ✅ Parsear JSON limpio
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("Error al analizar el CV:", error.message);
    throw {
      error: "No se pudo parsear la respuesta de Gemini",
      raw: error.response?.data || error.message
    };
  }
};

// aiService.js
const guardarDatosCVExtraidos = async (userId, datosCV) => {
  const {
    habilidades_tecnicas = [],
    habilidades_blandas = [],
    certificaciones = []
  } = datosCV;

  /* ---------- 1. HABILIDADES ---------- */
  const guardarHabilidad = async (nombre, esTecnica) => {
    // 1.a ¿Existe la habilidad?
    let { data: habilidad } = await supabase
      .from('habilidades')
      .select('idhabilidad')
      .eq('nombre', nombre)
      .maybeSingle();


    // 1.c Vincular al usuario (solo si aún no la tiene)
    const { data: yaAsociada } = await supabase
      .from('usuario_habilidad')
      .select('idusuario')
      .eq('idusuario', userId)
      .eq('idhabilidad', habilidad.idhabilidad)
      .maybeSingle();

    if (!yaAsociada) {
      await supabase
        .from('usuario_habilidad')
        .insert([{ idusuario: userId, idhabilidad: habilidad.idhabilidad }]);
    }
  };

  // guarda técnicas → true, blandas → false
  for (const h of habilidades_tecnicas) await guardarHabilidad(h, true);
  for (const h of habilidades_blandas)  await guardarHabilidad(h, false);

  /* ---------- 2. CERTIFICACIONES ---------- */
  for (const cert of certificaciones) {
    const {
      nombre,
      entidad,
      fecha_inicio: fechaInicioDoc = null,
      fecha_fin:   fechaFinDoc   = null
    } = cert;

    // 2.a Fechas por defecto
    const hoy = new Date();
    const isoHoy = hoy.toISOString().split('T')[0];

    const finDefault = new Date(hoy);
    finDefault.setFullYear(hoy.getFullYear() + 2);
    const isoFinDefault = finDefault.toISOString().split('T')[0];

    const fechaObtenido   = fechaInicioDoc || isoHoy;
    const fechaExpiracion = fechaFinDoc   || isoFinDefault;

    // 2.b ¿Existe ya la certificación?
    let { data: certExistente } = await supabase
      .from('certificaciones')
      .select('idcertificaciones')
      .eq('cnombre', nombre)
      .eq('emitidopor', entidad)
      .maybeSingle();

    // 2.c Insertar si no existe
    if (!certExistente) {
      const insert = await supabase
        .from('certificaciones')
        .insert([{
          cnombre: nombre,
          emitidopor: entidad,
          fechaobtenido: fechaObtenido,
          fechaexpiracion: fechaExpiracion
        }])
        .select()
        .single();
      certExistente = insert.data;
    }

    // 2.d Vincular al usuario si aún no la tiene
    const { data: yaTiene } = await supabase
      .from('usuario_certificado')
      .select('*')
      .eq('idusuario', userId)
      .eq('idcertificaciones', certExistente.idcertificaciones)
      .maybeSingle();

    if (!yaTiene) {
      await supabase
        .from('usuario_certificado')
        .insert([{ idusuario: userId, idcertificaciones: certExistente.idcertificaciones }]);
    }
  }

  return true; // éxito
};

const mejorarTextoConGemini = async (textoOriginal) => {
  try {
    const prompt = `
Mejora el siguiente texto para que sea más formal, técnico y profesional. Devuélvelo como texto plano sin comillas ni formato adicional en ingles:

"${textoOriginal}"
`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return result?.trim() || 'No se pudo mejorar el texto.';
  } catch (error) {
    console.error('Error al mejorar texto:', error.message);
    throw new Error('Error al mejorar el texto.');
  }
};



module.exports = { extractCVDataWithGemini, guardarDatosCVExtraidos, mejorarTextoConGemini };
