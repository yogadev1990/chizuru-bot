import AutoReplyModel from "../models/autoReply.model.js";
import TriggerModel from "../models/trigger.model.js"
import ButtonResponseModel from "../models/buttonRespon.model.js";
import ListResponseModel from "../models/listRespon.model.js";
import GrupModel from "../models/grouplist.model.js";
import { moment } from "../../config/index.js";

class ButtonResponse {
	constructor() {
		this.button = ButtonResponseModel;
	}

	async createButtonResponse(session_name, target_number, msg_id, button, btnMessage) {
		for (let j = 0; j < button.filter((x) => x != "").length; j++) {
			await this.button.create({ session_name, target_number, msg_id, keyword: button.filter((x) => x != "")[j], response: btnMessage.filter((x) => x != "")[j] });
		}
	}

	async checkKeyword(keyword, target_number) {
		const array = await this.button.findAll({ where: { target_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index === -1) return false;
			return array[index];
		} else {
			return false;
		}
	}

	async deleteKeyword(msg_id, keyword) {
		const array = await this.button.findAll({ where: { msg_id } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			const db = await this.button.findOne({ where: { id: array[index].id } });
			await db.destroy();
		}
	}
}

class ListResponse {
	constructor() {
		this.list = ListResponseModel;
	}

	async createListResponse(session_name, target_number, msg_id, list, responList) {
		for (let j = 0; j < list.filter((x) => x != "").length; j++) {
			await this.list.create({ session_name, target_number, msg_id, keyword: list.filter((x) => x != "")[j], response: responList.filter((x) => x != "")[j] });
		}
	}

	async checkKeyword(keyword, target_number) {
		const array = await this.list.findAll({ where: { target_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index === -1) return false;
			return array[index];
		} else {
			return false;
		}
	}
}

class AutoReply {
	constructor() {
		this.reply = AutoReplyModel;
	}

	async createAutoReply(session_name, session_number, keyword, response) {
		let date = moment().format("DD/MM/YY HH:mm:ss");
		await this.reply.create({ session_name, session_number, keyword, date, response });
	}

	async checkExistAutoReply(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			if (index !== -1) return true;
			else return false;
		} else {
			return false;
		}
	}

	async checkReplyMessage() {
		const array = await this.reply.findAll();
		if (Array.isArray(array) && array.length) {
			return array;
		}
	}

	async editReplyMessage(session_number, keyword, newKeyword, newRespon) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			array.map(async (value) => {
				if (value.keyword == keyword) {
					await this.reply.update(
						{ keyword: newKeyword, response: newRespon },
						{
							where: {
								id: value.id,
							},
						}
					);
				}
			});
		}
	}

	async deleteReplyMessage(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number } });
		if (Array.isArray(array) && array.length) {
			const index = array.findIndex((x) => x.keyword == keyword);
			const db = await this.reply.findOne({ where: { id: array[index].id } });
			await db.destroy();
		}
	}

	async checkMessageUser(session_number, keyword) {
		const array = await this.reply.findAll({ where: { session_number: session_number.split("@")[0] } });
		if (Array.isArray(array) && array.length !== 0) {
			const index = array.findIndex((x) => x.keyword.toLowerCase() == keyword.toLowerCase());
			if (index === -1) return false;
			const db = await this.reply.findOne({ where: { id: array[index].id } });
			return db;
		} else {
			return false;
		}
	}

	async deleteAllKeyword() {
		await this.reply.destroy({ truncate: true });
	}
}

class Trigger {
    static async addTrigger(groupId, timestamp) {
        try {
            const newTrigger = await TriggerModel.create({
                group_id: groupId,
                timestamp: timestamp
            });
            return newTrigger;
        } catch (error) {
            console.error('Error adding trigger:', error);
            throw new Error('Failed to add trigger to the database.');
        }
    }

    static async getAllTriggers() {
        try {
            const triggers = await TriggerModel.findAll();
            return triggers;
        } catch (error) {
            console.error('Error getting triggers:', error);
            throw new Error('Failed to get triggers from the database.');
        }
    }

    static async getTriggersByGroupId(groupId) {
        try {
            const triggers = await TriggerModel.findAll({
                where: {
                    group_id: groupId
                }
            });
            return triggers;
        } catch (error) {
            console.error('Error getting triggers by group ID:', error);
            throw new Error('Failed to get triggers by group ID from the database.');
        }
    }

    static async deleteTriggerById(triggerId) {
        try {
            const deletedTrigger = await TriggerModel.destroy({
                where: {
                    id: triggerId
                }
            });
            return deletedTrigger;
        } catch (error) {
            console.error('Error deleting trigger:', error);
            throw new Error('Failed to delete trigger from the database.');
        }
    }

    static async updateTrigger(groupId, newTimestamp) {
        try {
            const [updatedTrigger] = await TriggerModel.update(
                { timestamp: newTimestamp },
                { where: { group_id: groupId } }
            );
            return updatedTrigger;
        } catch (error) {
            console.error('Error updating trigger:', error);
            throw new Error('Failed to update trigger in the database.');
        }
    }
}
class VipGrup {
	async Vipstart(groupId) {
		try {
			const currentSubscription = await GrupModel.findOne({
				where: { group_id: groupId },
			});
			const additionalSubscriptionTime = 30 * 24 * 60 * 60 * 1000;
			if (currentSubscription) {
				const currentSubscriptionEndTime = currentSubscription.timeremaining;
				const currentTime = Date.now();
	
				if (currentTime < currentSubscriptionEndTime) {
					const newEndTime = currentSubscriptionEndTime + additionalSubscriptionTime;
					await GrupModel.update({
						timeremaining: newEndTime
					}, {
						where: { group_id: groupId }
					});
				} else {
					const newEndTime = currentTime + additionalSubscriptionTime;
					await GrupModel.update({
						timeremaining: newEndTime,
					}, {
						where: { group_id: groupId }
					});
				}
			} else {
				const newEndTime = Date.now() + additionalSubscriptionTime;
				await GrupModel.create({
					group_id: groupId,
					timeremaining: newEndTime,
					antivirtex: true,
					antitoxic: false,
					antilink: false,
					nsfw: false,
					welcome:true,
					out: true,
				});
			}
		} catch (error) {
			console.error('Error updating or adding subscription:', error);
			throw new Error('Failed to update or add subscription in the database.');
		}
	}
	static async ceksubs(groupId) {
		try {
			const subscription = await GrupModel.findOne({
				where: { group_id: groupId },
			});
			if (!subscription) {
				return false;
			}
			const currentSubscriptionEndTime = subscription.timeremaining;
			const currentTime = Date.now();
			if (currentTime < currentSubscriptionEndTime) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Error checking subscription:', error);
			throw new Error('Failed to check subscription in the database.');
		}
	}
	static async cekwelcome(groupId) {
		try {
			const welcome = await GrupModel.findOne({
				where: { group_id: groupId },
			}); 
			return welcome.welcome;
		} catch (error) {
			console.error('Error checking welcome:', error);
			throw new Error('Failed to check welcome in the database.');
		}
	}
	static async cekout(groupId) {
		try {
			const out = await GrupModel.findOne({
				where: { group_id: groupId },
			}); 
			return out.out;
		} catch (error) {
			console.error('Error checking out:', error);
			throw new Error('Failed to check out in the database.');
		}
	}
	static async getStatusVIP(groupId) {
		try {
			const isSubscribed = await VipGrup.ceksubs(groupId);
	
			if (isSubscribed) {
				return 'Aktif'; // Grup sudah berlangganan
			} else {
				return 'Tidak Aktif'; // Grup belum berlangganan atau waktu langganan telah habis
			}
		} catch (error) {
			console.error('Error getting VIP status:', error);
			throw new Error('Failed to get VIP status from the database.');
		}
	}
	static async findOneAndUpdate(groupId, data) {
		try {
			const updatedGroup = await GrupModel.update(data, {
				where: { group_id: groupId },
			});
			return updatedGroup;
		} catch (error) {
			console.error('Error updating group:', error);
			throw new Error('Failed to update group in the database.');
		}
	}
	static async getSisaLangganan(groupId) {
		try {
			// Cek apakah grup sudah berlangganan dan dapatkan waktu langganan yang tersisa jika berlangganan
			const isSubscribed = await VipGrup.ceksubs(groupId);
	
			if (isSubscribed) {
				const subscription = await GrupModel.findOne({
					where: { group_id: groupId },
				});
				const currentSubscriptionEndTime = subscription.timeremaining;
				const currentTime = Date.now();
				const remainingTime = currentSubscriptionEndTime - currentTime;
	
				if (remainingTime > 0) {
					const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
					const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
					
					return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
				} else {
					return 0; // Grup belum berlangganan atau waktu langganan telah habis
				}
			} else {
				return 0; // Grup belum berlangganan atau waktu langganan telah habis
			}
		} catch (error) {
			console.error('Error getting remaining subscription time:', error);
			throw new Error('Failed to get remaining subscription time from the database.');
		}
	}
	
	
	
	
}


export { ButtonResponse, ListResponse, AutoReply, Trigger, VipGrup};
