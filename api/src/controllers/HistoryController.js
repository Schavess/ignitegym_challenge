const AppError = require("../utils/AppError");
const knex = require("../database");
const dayjs = require("dayjs");
const axios = require("axios");
require('dotenv').config();

class HistoryController {
  async index(request, response) {
    const user_id = request.user.id;

    const history = await knex("history")
      .select(
        "history.id",
        "history.user_id",
        "history.exercise_id",
        "exercises.name",
        "exercises.group",
        "history.created_at"
      )
      .leftJoin("exercises", "exercises.id", "=", "history.exercise_id")
      .where({ user_id }).orderBy("history.created_at", "desc");

    const days = [];

    for (let exercise of history) {
      const day = dayjs(exercise.created_at).format('DD.MM.YYYY');

      if (!days.includes(day)) {
        days.push(day);
      }
    }

    const exercisesByDay = days.map(day => {
      const exercises = history
        .filter((exercise) => dayjs(exercise.created_at).format('DD.MM.YYYY') === day).
        map((exercise) => {
          return {
            ...exercise,
            hour: dayjs(exercise.created_at).format('HH:mm')
          }
        });

      return ({ title: day, data: exercises });
    });

    return response.json(exercisesByDay);
  }

  async create(request, response) {
    const { exercise_id } = request.body;
    const user_id = request.user.id;

    if (!exercise_id) {
      throw new AppError("Informe o id do exercício.");
    }

    const user = await knex("users").select("email").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    await knex("history").insert({ user_id, exercise_id });

    // Enviar notificação
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ['All'],
      contents: {
        'en': 'Parabéns por completar o exercício!'
      },
      include_email_tokens: [user.email] // Usar o email do usuário como identificador
    };

    try {
      const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic 'NWY3ZThiOTctNmYwNC00N2U2LTk1NjYtMjk3MWU3YTIzMWUy'`
        }
      });
      console.log('Notification sent successfully, ID:', response.data.id);
    } catch (error) {
      console.error('Error sending notification:', error.response ? error.response.data : error);
      throw new AppError("Erro ao enviar notificação.");
    }

    return response.status(201).json();
  }
}

module.exports = HistoryController;
