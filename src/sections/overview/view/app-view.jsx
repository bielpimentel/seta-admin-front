import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import SvgColor from 'src/components/svg-color';

import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Solicitações pendentes"
            total={4}
            icon={
              <SvgColor
                src="/assets/icons/navbar/ic_pending.svg"
                color="#1877F2"
                sx={{ width: 1, height: 1 }}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Usuários cadastrados"
            total={335}
            icon={
              <SvgColor
                src="/assets/icons/navbar/ic_user_list.svg"
                color="#1877F2"
                sx={{ width: 1, height: 1 }}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Logs no mês"
            total={500}
            icon={
              <SvgColor
                src="/assets/icons/navbar/ic_logs.svg"
                color="#1877F2"
                sx={{ width: 1, height: 1 }}
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Novos contatos"
            total={23}
            icon={
              <SvgColor
                src="/assets/icons/navbar/ic_support.svg"
                color="#1877F2"
                sx={{ width: 1, height: 1 }}
              />
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Movimentação no campus (mensal)"
            subheader="+43% em relação ao mês passado"
            chart={{
              labels: [
                '2025-01-01',
                '2025-01-02',
                '2025-01-03',
                '2025-01-04',
                '2025-01-05',
                '2025-01-06',
                '2025-01-07',
                '2025-01-08',
                '2025-01-09',
                '2025-01-10',
                '2025-01-11',
              ],
              series: [
                {
                  name: 'Docentes',
                  type: 'area',
                  fill: 'gradient',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Alunos',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Outros',
                  type: 'area',
                  fill: 'gradient',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Logs registrados no ano"
            chart={{
              series: [
                { label: 'Docentes', value: 3344 },
                { label: 'Alunos', value: 8435 },
                { label: 'Outros', value: 1443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Relação de acessos mês a mês"
            subheader="+12% em relação ao ano passado"
            chart={{
              series: [
                { label: 'Julho 2024', value: 600 },
                { label: 'Agosto 2024', value: 800 },
                { label: 'Setembro 2024', value: 900 },
                { label: 'Outubro 2024', value: 1000 },
                { label: 'Novembro 2024', value: 400 },
                { label: 'Dezembro 2024', value: 1000 },
                { label: 'Janeiro 2025', value: 1200 },
                { label: 'Fevereiro 2025', value: 900 },
                { label: 'Março 2025', value: 800 },
                { label: 'Abril 2025', value: 700 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Próximos eventos"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                'Semana de Provas',
                'Feira de Profissões',
                'Semana de Integração',
                'Formação de Turmas',
                'Recesso Escolar',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.future(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
