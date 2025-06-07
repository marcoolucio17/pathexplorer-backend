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
ASP.NET Core - Técnica
Blazor WebAssembly - Técnica
C# 12 Language Features - Técnica
Entity Framework Core - Técnica
LINQ Mastery - Técnica
SignalR - Técnica
WPF / WinUI 3 Desktop Apps - Técnica
.NET MAUI (cross-platform UI) - Técnica
.NET Microservices With Dapr - Técnica
Azure DevOps Pipelines - Técnica
Dapper Micro-ORM - Técnica
Dependency Injection (built-in container) - Técnica
gRPC For .NET - Técnica
NuGet Package Management - Técnica
Performance Profiling (dotTrace) - Técnica
Roslyn Analyzers & Source Generators - Técnica
Task-Based Async Programming - Técnica
Unity / Prism MVVM Frameworks - Técnica
xUnit / NUnit Testing - Técnica
MLOps - Técnica
Fine-Tuning - Técnica
Model Lifecycle - Técnica
Responsible AI - Técnica
Vector DBs - Técnica
AI Code Review - Técnica
Prompt Engineering - Técnica
Workflow Orchestration - Técnica
GraphQL - Técnica
OpenAPI - Técnica
REST - Técnica
Event Streaming Kafka/Pulsar - Técnica
gRPC - Técnica
Unity - Técnica
Unreal - Técnica
WebXR - Técnica
Shader Programming - Técnica
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
AWS VPC Design - Técnica
Amazon CloudWatch - Técnica
Amazon EC2 - Técnica
Amazon Kinesis - Técnica
Amazon RDS - Técnica
Amazon S3 - Técnica
Amazon SNS - Técnica
Amazon SQS - Técnica
Hardhat/Foundry - Técnica
Solidity - Técnica
Security Audits - Técnica
AWS/Azure/GCP - Técnica
CI/CD - Técnica
Docker - Técnica
IaC - Técnica
Kubernetes - Técnica
Git Mastery - Suave
Agile Practices - Suave
Architectural Writing - Suave
Code Reviews - Suave
Communication - Suave
Algorithms - Técnica
Complexity - Técnica
Data Structures - Técnica
Memory - Técnica
Amazon Redshift - Técnica
Apache Superset - Técnica
Azure Synapse Analytics - Técnica
Google BigQuery - Técnica
Informatica PowerCenter - Técnica
Looker / Looker Studio - Técnica
Power BI - Técnica
Snowflake - Técnica
Tableau - Técnica
Talend Open Studio - Técnica
Dbt (Core & Cloud) - Técnica
Airflow - Técnica
ETL/ELT - Técnica
SQL + NoSQL Tuning - Técnica
Spark/Flink - Técnica
Data Lakes - Técnica
Ansible - Técnica
Argo CD - Técnica
GitHub Actions - Técnica
GitLab CI/CD - Técnica
Helm Charts - Técnica
Jenkins - Técnica
Packer - Técnica
Site Reliability Engineering (SRE) - Técnica
Spinnaker - Técnica
Terraform Modules & Workspaces - Técnica
Angular - Técnica
Angular Material - Técnica
Next.js - Técnica
React 18 - Técnica
Redux Toolkit / NgRx - Técnica
Tailwind CSS - Técnica
TypeScript - Técnica
Webpack & Vite - Técnica
Apache Kafka (Java Client) - Técnica
GraalVM Native Image - Técnica
Gradle - Técnica
Hibernate / JPA - Técnica
JUnit & Mockito Testing - Técnica
JVM GC Tuning & Performance - Técnica
Jakarta EE - Técnica
Java Flight Recorder - Técnica
Maven - Técnica
MicroProfile - Técnica
Micronaut - Técnica
Quarkus - Técnica
Reactive Streams (Reactor / RxJava) - Técnica
Spring Boot - Técnica
Spring Framework - Técnica
Appian - Técnica
Mendix - Técnica
Power Platform - Técnica
UiPath - Técnica
Android Jetpack Compose - Técnica
Android Studio - Técnica
Combine & Async/Await - Técnica
Core Data - Técnica
Cross-Platform Kotlin Multiplatform - Técnica
Flutter - Técnica
Hilt & Room - Técnica
Kotlin + Jetpack Compose - Técnica
Objective-C Legacy - Técnica
React Native - Técnica
SwiftUI - Técnica
IOS SwiftUI - Técnica
C/C++ - Técnica
Go - Técnica
Java/Kotlin - Técnica
Python - Técnica
Rust - Técnica
Swift - Técnica
TypeScript/JS - Técnica
OpenTelemetry - Técnica
Prometheus - Técnica
SLO/SLA - Técnica
Incident Command - Técnica
Tracing - Técnica
Async/Reactive Patterns - Técnica
Caching - Técnica
Load-Balancing - Técnica
Confluence Knowledge Bases - Técnica
Jira Administration - Técnica
Kanban Flow - Técnica
OKR Road-Mapping - Técnica
PMI / PMP Framework - Técnica
PRINCE2 - Técnica
Risk & Issue Management - Técnica
SAFe 5.0 - Técnica
Scrum Mastery - Técnica
Q# - Técnica
Qiskit - Técnica
Edge Orchestration - Técnica
ABAP OO - Técnica
SAP BTP (Business Technology Platform) - Técnica
SAP Fiori UX - Técnica
SAP HANA Modelling - Técnica
SAP Integration Suite / PI-PO - Técnica
SAP S/4HANA Extensibility - Técnica
SAP SuccessFactors - Técnica
SAP UI5 - Técnica
Cassandra - Técnica
InfluxDB (Time-Series) - Técnica
Microsoft SQL Server - Técnica
MongoDB - Técnica
MySQL / MariaDB - Técnica
Neo4j - Técnica
Oracle Database - Técnica
PostgreSQL - Técnica
Redis - Técnica
SQLite - Técnica
IAM - Técnica
OWASP - Técnica
SAST/DAST - Técnica
SBOM - Técnica
Threat Modeling - Técnica
Zero-Trust - Técnica
Accountability - Suave
Active Listening - Suave
Adaptability - Suave
Collaboration - Suave
Communication - Suave
Conflict Resolution - Suave
Creativity & Innovation - Suave
Critical Thinking - Suave
Cultural Awareness - Suave
Decision-Making - Suave
Emotional Intelligence - Suave
Empathy - Suave
Facilitation - Suave
Flexibility - Suave
Growth Mindset - Suave
Leadership - Suave
Mentoring & Coaching - Suave
Negotiation - Suave
Networking - Suave
Presentation Skills - Suave
Prioritization - Suave
Problem-Solving - Suave
Public Speaking - Suave
Resilience - Suave
Self-Motivation - Suave
Stakeholder Management - Suave
Stress Management - Suave
Teamwork - Suave
Technical Writing - Suave
Time Management - Suave
DDD - Técnica
OOP - Técnica
Functional - Técnica
Micro-/Event-Driven Services - Técnica
C/C++ Optimization - Técnica
Rust Safety - Técnica
Concurrency - Técnica
eBPF - Técnica
Embedded/IoT - Técnica
Playwright/Cypress - Técnica
TDD/BDD - Técnica
Chaos Engineering - Técnica
Contract Testing - Técnica
Property Tests - Técnica
Accessibility (WCAG 2.2) - Técnica
Adobe XD - Técnica
Design Systems (Storybook, Material 3) - Técnica
Figma - Técnica
Interaction & Motion Design - Técnica
Responsive & Mobile-First Design - Técnica
Sketch - Técnica
Usability Testing - Técnica
PWA Patterns - Técnica
React/Next.js - Técnica
Svelte - Técnica
Vue - Técnica
WebAssembly - Técnica
Docker Compose - Técnica
OpenShift - Técnica
Jest - Técnica
LangChain - Técnica
DataDog Monitoring - Técnica


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

    // 🧹 Limpiar el bloque markdown ```json ... ```
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
const guardarDatosCVExtraidos = async (userId, datosCV) => {
  const { habilidades_tecnicas, habilidades_blandas, certificaciones } = datosCV;

  // Guardar habilidades técnicas y blandas
  const guardarHabilidad = async (nombre, esTecnica) => {
    // Buscar si ya existe
    let { data: habilidad, error } = await supabase
      .from('habilidades')
      .select('idhabilidad')
      .eq('nombre', nombre)
      .maybeSingle();

    // Si no existe, insertarla
    if (!habilidad) {
      const insert = await supabase
        .from('habilidades')
        .insert([{ nombre, estecnica: esTecnica }])
        .select()
        .single();
      habilidad = insert.data;
    }

    // Asociar al usuario (si no existe ya)
    const yaAsociada = await supabase
      .from('usuario_habilidad')
      .select('*')
      .eq('idusuario', userId)
      .eq('idhabilidad', habilidad.idhabilidad)
      .maybeSingle();

    if (!yaAsociada.data) {
      await supabase
        .from('usuario_habilidad')
        .insert([{ idusuario: userId, idhabilidad: habilidad.idhabilidad }]);
    }
  };

  for (const h of habilidades_tecnicas) {
    await guardarHabilidad(h, true);
  }

  for (const h of habilidades_blandas) {
    await guardarHabilidad(h, false);
  }

  // Guardar certificaciones
  for (const cert of certificaciones) {
    const { nombre, entidad } = cert;

    // Buscar si ya existe la certificación
    let { data: certExistente, error } = await supabase
      .from('certificaciones')
      .select('idcertificaciones')
      .eq('cnombre', nombre)
      .maybeSingle();

    // Insertar si no existe
    if (!certExistente) {
      const insert = await supabase
        .from('certificaciones')
        .insert([{ cnombre: nombre, emitidopor: entidad }])
        .select()
        .single();
      certExistente = insert.data;
    }

    // Asociar al usuario
    const yaTiene = await supabase
      .from('usuario_certificado')
      .select('*')
      .eq('idusuario', userId)
      .eq('cnombre', nombre)
      .maybeSingle();

    if (!yaTiene.data) {
      await supabase
      .from('usuario_certificado')
      .insert([{ idusuario: userId, idcertificaciones: certExistente.idcertificaciones }]);
    }
  }

  return true;
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
