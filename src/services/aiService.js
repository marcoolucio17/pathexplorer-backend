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
Algorithms - Técnica
Data Structures - Técnica
Complexity - Técnica
Memory - Técnica
Python - Técnica
Rust - Técnica
Go - Técnica
Typescript/JS - Técnica
Java/Kotlin - Técnica
C/C++ - Técnica
Swift - Técnica
OOP - Suave
Functional - Suave
DDD - Suave
Micro-/Event-Driven Services - Suave
AWS/Azure/GCP - Técnica
Kubernetes - Técnica
Docker - Técnica
Iac - Técnica
CI/CD - Técnica
Model Lifecycle - Técnica
Vector Dbs - Técnica
Fine-Tuning - Técnica
Mlops - Técnica
Responsible AI - Técnica
ETL/ELT - Técnica
Spark/Flink - Técnica
Data Lakes - Técnica
Airflow - Técnica
SQL + Nosql Tuning - Técnica
Concurrency - Técnica
Embedded/Iot - Técnica
Rust Safety - Técnica
C/C++ Optimization - Técnica
Ebpf - Técnica
React/Next.Js - Técnica
Vue - Técnica
Svelte - Técnica
Webassembly - Técnica
PWA Patterns - Técnica
Kotlin + Jetpack Compose - Técnica
Swiftui - Técnica
Flutter - Técnica
React Native - Técnica
REST - Técnica
Graphql - Técnica
Grpc - Técnica
Openapi - Técnica
Event Streaming Kafka/Pulsar - Técnica
TDD/BDD - Técnica
Property Tests - Técnica
Playwright/Cypress - Técnica
Contract Testing - Técnica
Chaos Engineering - Técnica
OWASP - Técnica
Threat Modeling - Técnica
SAST/DAST - Técnica
IAM - Técnica
SBOM - Técnica
Zero-Trust - Técnica
Prometheus - Técnica
Opentelemetry - Técnica
Tracing - Técnica
SLO/SLA - Técnica
Incident Command - Técnica
Load-Balancing - Técnica
Caching - Técnica
Async/Reactive Patterns - Técnica
Prompt Engineering - Técnica
AI Code Review - Técnica
Workflow Orchestration - Técnica
Appian - Técnica
Mendix - Técnica
Power Platform - Técnica
Uipath - Técnica
Solidity - Técnica
Hardhat/Foundry - Técnica
Security Audits - Técnica
Unity - Técnica
Unreal - Técnica
Webxr - Técnica
Shader Programming - Técnica
Qiskit - Técnica
Q# - Técnica
Edge Orchestration - Técnica
Git Mastery - Técnica
Agile Practices - Técnica
Code Reviews - Técnica
Architectural Writing - Técnica
Communication - Técnica
Spring Framework - Técnica
Spring Boot - Técnica
Jakarta EE - Técnica
Hibernate / JPA - Técnica
Quarkus - Técnica
Micronaut - Técnica
Apache Kafka (Java Client) - Técnica
Maven - Técnica
Gradle - Técnica
Junit & Mockito Testing - Técnica
Reactive Streams (Reactor / Rxjava) - Técnica
Microprofile - Técnica
Graalvm Native Image - Técnica
Java Flight Recorder - Técnica
JVM GC Tuning & Performance - Técnica
AWS Lambda - Técnica
Amazon EC2 - Técnica
Amazon S3 - Técnica
Amazon RDS - Técnica
AWS Dynamodb - Técnica
AWS ECS - Técnica
AWS EKS - Técnica
AWS Fargate - Técnica
AWS Cloudformation - Técnica
AWS CDK (Cloud Development Kit) - Técnica
AWS API Gateway - Técnica
AWS Step Functions - Técnica
Amazon SNS - Técnica
Amazon SQS - Técnica
Amazon Cloudwatch - Técnica
AWS IAM (Identity & Access Management) - Técnica
AWS VPC Design - Técnica
Amazon Kinesis - Técnica
AWS Glue - Técnica
AWS Elastic Beanstalk - Técnica
C# 12 Language Features - Técnica
ASP.NET Core - Técnica
Entity Framework Core - Técnica
Blazor Webassembly - Técnica
.NET MAUI (Cross-Platform UI) - Técnica
Signalr - Técnica
LINQ Mastery - Técnica
Task-Based Async Programming - Técnica
Dapper Micro-ORM - Técnica
Dependency Injection (Built-In Container) - Técnica
Azure Devops Pipelines - Técnica
Nuget Package Management - Técnica
.NET Microservices With Dapr - Técnica
Grpc For .NET - Técnica
Roslyn Analyzers & Source Generators - Técnica
Performance Profiling (Dottrace) - Técnica
WPF / Winui 3 Desktop Apps - Técnica
Unity / Prism MVVM Frameworks - Técnica
Xunit / Nunit Testing - Técnica
Power BI - Técnica
Tableau - Técnica
Looker / Looker Studio - Técnica
Snowflake - Técnica
Google Bigquery - Técnica
Amazon Redshift - Técnica
Azure Synapse Analytics - Técnica
Dbt (Core & Cloud) - Técnica
Apache Superset - Técnica
Informatica Powercenter - Técnica
Talend Open Studio - Técnica
Microsoft SQL Server - Técnica
Postgresql - Técnica
Mysql / Mariadb - Técnica
Oracle Database - Técnica
Sqlite - Técnica
Mongodb - Técnica
Redis - Técnica
Cassandra - Técnica
Neo4j - Técnica
Influxdb (Time-Series) - Técnica
Figma - Técnica
Adobe XD - Técnica
Sketch - Técnica
Design Systems (Storybook, Material 3) - Técnica
Responsive & Mobile-First Design - Técnica
Accessibility (WCAG 2.2) - Técnica
Usability Testing - Técnica
Interaction & Motion Design - Técnica
Jenkins - Técnica
Github Actions - Técnica
Gitlab CI/CD - Técnica
Argo CD - Técnica
Spinnaker - Técnica
Helm Charts - Técnica
Ansible - Técnica
Packer - Técnica
Terraform Modules & Workspaces - Técnica
Site Reliability Engineering (SRE) - Técnica
Angular - Técnica
Angular Material - Técnica
React 18 - Técnica
Next.Js - Técnica
Typescript - Técnica
Redux Toolkit / Ngrx - Técnica
Webpack & Vite - Técnica
Tailwind CSS - Técnica
Android Studio - Técnica
Android Jetpack Compose - Técnica
Hilt & Room - Técnica
Ios Swiftui - Técnica
Combine & Async/Await - Técnica
Objective-C Legacy - Técnica
Core Data - Técnica
Cross-Platform Kotlin Multiplatform - Técnica
ABAP OO - Técnica
SAP HANA Modelling - Técnica
SAP Fiori UX - Técnica
SAP UI5 - Técnica
SAP BTP (Business Technology Platform) - Técnica
SAP S/4HANA Extensibility - Técnica
SAP Integration Suite / PI-PO - Técnica
SAP Successfactors - Técnica
Scrum Mastery - Técnica
Kanban Flow - Técnica
Safe 5.0 - Técnica
Jira Administration - Técnica
Confluence Knowledge Bases - Técnica
PMI / PMP Framework - Técnica
PRINCE2 - Técnica
OKR Road-Mapping - Técnica
Risk & Issue Management - Técnica
Communication - Suave
Technical Writing - Suave
Active Listening - Suave
Public Speaking - Suave
Presentation Skills - Suave
Stakeholder Management - Suave
Negotiation - Suave
Conflict Resolution - Suave
Teamwork - Suave
Collaboration - Suave
Leadership - Suave
Mentoring & Coaching - Suave
Emotional Intelligence - Suave
Empathy - Suave
Problem-Solving - Suave
Critical Thinking - Suave
Creativity & Innovation - Suave
Adaptability - Suave
Resilience - Suave
Flexibility - Suave
Time Management - Suave
Prioritization - Suave
Decision-Making - Suave
Accountability - Suave
Growth Mindset - Suave
Self-Motivation - Suave
Stress Management - Suave
Facilitation - Suave
Networking - Suave
Cultural Awareness - Suave

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

    // Parsear JSON limpio
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

  // ⬇️  Si no existe, la ignoramos y registramos en log
    if (!habilidad) {
      console.log(`Skill no encontrada, se omite: ${nombre}`);
      return;
    }

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
Mejora y modifica el siguiente texto para que sea más formal, técnico y profesional, aumentando su extensnion a no mas de 50 palabras. Devuélvelo como texto plano sin comillas ni formato adicional en ingles:

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
