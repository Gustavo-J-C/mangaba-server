'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela fazendas
    await queryInterface.createTable('fazendas', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      localizacao: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true,
      },
      area_total: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela usuarios
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      ds_tipo_documento: {
        type: Sequelize.ENUM('CPF', 'CNPJ'),
        allowNull: false,
      },
      nu_documento: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true, 
      },
      ds_nome_completo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ds_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      ds_senha: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      codigo_verificacao: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      // *** CORREÇÃO ADICIONADA ***
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'fazendas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // *** FIM DA CORREÇÃO ***
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela funcionarios
    await queryInterface.createTable('funcionarios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cargo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
        // Adicionando onUpdate e onDelete para consistência
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela plantacoes
    await queryInterface.createTable('plantacoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: true, 
        references: {
          model: 'fazendas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      usuario_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ds_nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ds_descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela arvores
    await queryInterface.createTable('arvores', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      plantacoes_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'plantacoes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ds_nome: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      ds_descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      localizacao: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
      },
      // Adicionando colunas que estavam no dump
      dt_plantio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Plantada', 'Vingou', 'Não Vingou', 'Produzindo'),
        allowNull: true,
      },
      qt_extracoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      vl_total_extracoes: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        defaultValue: 0,
      },
      md_frutos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      md_tempo_extracoes: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      // Fim das colunas adicionadas
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela periodos
    // Mantendo a sua definição
    await queryInterface.createTable('periodos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      plantacoes_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'plantacoes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tipo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      dt_inicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dt_fim: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // Periodos não tinha timestamps no seu código,
      // mas é uma boa prática adicionar
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela extracoes
    await queryInterface.createTable('extracoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      arvores_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'arvores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      vl_volume: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Criar tabela servicos
    await queryInterface.createTable('servicos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      custo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      data_execucao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fazenda_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'fazendas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      funcionario_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'funcionarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Trocado para SET NULL para não perder o serviço
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // *** TABELAS FALTANTES ADICIONADAS ABAIXO ***

    // 1. Criar tabela device_tokens (baseada no dump)
    await queryInterface.createTable('device_tokens', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 2. Criar tabela manutencoes (baseada no dump)
    await queryInterface.createTable('manutencoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      arvores_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'arvores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_extracao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_notificacao: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDENTE', 'ENVIADA', 'CONCLUIDA'),
        allowNull: false,
        defaultValue: 'PENDENTE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 3. Criar tabela notificacoes (baseada no dump)
    await queryInterface.createTable('notificacoes', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      arvore_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // Permite nulo
        references: {
          model: 'arvores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Apagar a notificação se a árvore for deletada
      },
      titulo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT('medium'), // mediumtext
        allowNull: false,
      },
      lida: {
        type: Sequelize.BOOLEAN, // tinyint(1)
        defaultValue: false,
      },
      tipo: {
        type: Sequelize.ENUM('MANUTENCAO', 'AVISO'),
        defaultValue: 'AVISO',
      },
      metadata: {
        type: Sequelize.TEXT('medium'), // mediumtext
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {

    // *** TABELAS ADICIONADAS ***
    await queryInterface.dropTable('notificacoes');
    await queryInterface.dropTable('manutencoes');
    await queryInterface.dropTable('device_tokens');
    // *** FIM DAS ADIÇÕES ***

    await queryInterface.dropTable('servicos');
    await queryInterface.dropTable('extracoes');
    await queryInterface.dropTable('periodos');
    await queryInterface.dropTable('arvores'); 
    await queryInterface.dropTable('plantacoes');
    await queryInterface.dropTable('funcionarios');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('fazendas');
  },
};